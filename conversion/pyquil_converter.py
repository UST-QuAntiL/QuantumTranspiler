from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
import pyquil.quilbase as pyquil_circuit_library
from circuit.qiskit_utility import show_figure
from conversion.gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate
from qiskit.circuit import Qubit, Clbit
from pyquil.gates import NOP, MEASURE
from qiskit.circuit.exceptions import CircuitError
from qiskit.circuit import Parameter as qiskit_Parameter
import qiskit.circuit as qiskit_circuit_library


class PyquilConverter:
    @staticmethod
    def import_quil(quil: str) -> QuantumCircuit:
        program = Program(quil)
        return PyquilConverter.import_pyquil(program)

    @staticmethod
    def import_pyquil(program: Program) -> (QuantumCircuit, {int: Qubit}, {str: Clbit}):
        qubit_set = program.get_qubits()
        qreg_mapping = {}
        creg_mapping = {}        

        qr = QuantumRegister(len(qubit_set), "q")
        for counter, qubit in enumerate(qubit_set):
            qreg_mapping[qubit] = qr[counter]
        circuit = QuantumCircuit(qr)

        for instr in program.instructions:
            if isinstance(instr, pyquil_circuit_library.Declare):
                if instr.memory_type != "BIT":
                    raise NotImplementedError(
                        "Unsupported memory type:" + str(instr.memory_type))

                cr = ClassicalRegister(instr.memory_size, instr.name)
                for i in range(instr.memory_size):
                    creg_mapping[instr.name + "_" + str(i)] = cr[i]
                circuit.add_register(cr)

            elif isinstance(instr, pyquil_circuit_library.Gate):
                PyquilConverter._handle_gate_import(circuit, instr, program, qreg_mapping)

            elif isinstance(instr, pyquil_circuit_library.Measurement):
                qubit = qreg_mapping[instr.qubit.index]
                clbit = creg_mapping[instr.classical_reg.name + "_" + str(instr.classical_reg.offset)]
                circuit.measure(qubit, clbit)

            elif isinstance(instr, pyquil_circuit_library.Pragma):
                # http://docs.rigetti.com/en/stable/basics.html#pragmas
                # pragmas do not change the semantics of a program
                # e.g. rewiring and delays
                # can be alternatively implemented with qiskit (https://qiskit.org/documentation/stubs/qiskit.pulse.Delay.html)
                continue
            elif isinstance(instr, NOP):                
                continue
            elif isinstance(instr, pyquil_circuit_library.Halt):
                break
            # TODO classical operations http://docs.rigetti.com/en/stable/apidocs/gates.html
            else:
                raise NotImplementedError(
                    "Unsupported instruction: " + str(instr))

        return (circuit, qreg_mapping, creg_mapping)

    @staticmethod
    def _handle_gate_import(circuit, instr, program, qreg_mapping) -> None:           
        if instr.name in gate_mapping_pyquil:           
            # get the instruction
            instr_qiskit_class = gate_mapping_pyquil[instr.name]
            # TODO check if division by pi is necessary (pytket does this)
            params = instr.params
            for i, param in enumerate(params):
                # parameterized circuit --> add Qiskit Parameter Object (convert from Pyquil Parameter Object)
                if isinstance(param, pyquil_Parameter):
                    params[i] = qiskit_Parameter(param.name)

            instr_qiskit = instr_qiskit_class(*params)

        # custom gates
        else:
            gate_found = False
            for gate in program.defined_gates:
                if gate.name == instr.name:
                    gate_found = True
                    if gate.parameters:                        
                        print(instr.params)
                        print(gate.matrix)
                        raise NotImplementedError("TODO: " + str(instr)) 
                    else:
                        instr_qiskit = UnitaryGate(gate.matrix, label=gate.name)
            
            if not gate_found:  
                raise NotImplementedError("Unsupported Gate: " + str(instr))                
            

        # get the qubits on which the instruction operates
        qargs = [qreg_mapping[qubit.index]
                    for qubit in instr.qubits]
        circuit.append(instr_qiskit, qargs=qargs)

      


    @staticmethod
    def export_quil(circuit: QuantumCircuit) -> str:
        (program, qreg_mapping, creg_mapping) = PyquilConverter.export_pyquil(circuit)
        return (program.out(), qreg_mapping, creg_mapping)

    @staticmethod
    def export_pyquil(circuit: QuantumCircuit, qubits_subcircuit = None, clbits_subcircuit = None) -> Program:        
        program = Program()
        qreg_mapping = {}
        creg_mapping = {}  

        
        # for subcircuits function is called recursively        
        for i, qubit in enumerate(circuit.qubits):
            if qubits_subcircuit:
                qreg_mapping[qubit] = qubits_subcircuit[i]
            # usual mapping
            else:
                qreg_mapping[qubit] = i                            

        for cr in circuit.cregs:
            creg_pyquil = program.declare(cr.name, 'BIT', cr.size)
            for i, clbit in enumerate(cr):
                if clbits_subcircuit:
                    creg_mapping[clbit] = clbits_subcircuit[i]
                else:
                    creg_mapping[clbit] = creg_pyquil[i]

        for instr in circuit.data:
            qiskit_gate = instr[0]
            qubits = [qreg_mapping[qubit] for qubit in instr[1]]
            
            if isinstance(qiskit_gate, qiskit_circuit_library.Gate):                
                # usual gates
                PyquilConverter._handle_gate_export(program, qiskit_gate, qubits)
                
            elif isinstance(instr[0], qiskit_circuit_library.Barrier):                
                # no pyquil equivalent
                continue
            elif isinstance(instr[0], qiskit_circuit_library.Measure):
                qubit = qreg_mapping[instr[1][0]]
                cbit = creg_mapping[instr[2][0]] 
                program += MEASURE(qubit, cbit)

            elif isinstance(instr[0], qiskit_circuit_library.Instruction):
                # for sub circuits: recursively build program
                clbits = [creg_mapping[clbit] for clbit in instr[2]]
                program += PyquilConverter.export_pyquil(instr[0].decompositions[0], qubits_subcircuit=qubits, clbits_subcircuit = clbits)[0]


            else:
                raise NotImplementedError("Unsupported Instruction: " + str(instr)) 

        return (program, qreg_mapping, creg_mapping)

    @staticmethod
    def _handle_gate_export(program, qiskit_gate, qubits) -> None:  
        params = None 
        gate = None

        qiskit_gate_class_name = qiskit_gate.__class__.__name__
        if qiskit_gate_class_name in gate_mapping_qiskit:
            params = qiskit_gate.params 
            # check if pyquil gate/replacement program is defined (else pyquil is None and the corresponding matrix might be used)
            if "pyquil" in gate_mapping_qiskit[qiskit_gate_class_name] and gate_mapping_qiskit[qiskit_gate_class_name]["pyquil"]:                
                pyquil_dict = gate_mapping_qiskit[qiskit_gate_class_name]["pyquil"]

                # 1:1 gate translation
                if "g" in pyquil_dict:
                    gate = pyquil_dict["g"]   
                # replacement program defined (no 1:1 pyquil gate available)
                # in this case gate is a program generating function defined in pyquil_replacement_programs
                elif "r" in pyquil_dict:
                    gate = pyquil_dict["r"]
                else:
                    raise NameError("Neither gate nor replacement program defined for: " + str(qiskit_gate))                  
                

            if (gate is None) and ("matrix" in gate_mapping_qiskit[qiskit_gate_class_name]):
                matrix = gate_mapping_qiskit[qiskit_gate_class_name]["matrix"]
                name = qiskit_gate_class_name
                gate = PyquilConverter._create_custom_gate_pyquil(program, matrix, name)   

            # parameter conversion
            for i, param in enumerate(params):
                    # parameterized circuit --> add Pyquil Parameter Object (convert from Qiskit Parameter Object)
                    if isinstance(param, qiskit_Parameter):
                           params[i] = pyquil_Parameter(param.name)
                                                 
        # by matrix defined gates
        if gate is None:
            try:
                matrix = qiskit_gate.to_matrix() 
                # get name (construction is the same as qiskit's in the qasm method)
                name = qiskit_gate.label if qiskit_gate.label else "unitary" + str(id(qiskit_gate)) 
                gate = PyquilConverter._create_custom_gate_pyquil(program, matrix, name)  
            except CircuitError:
                raise NotImplementedError("Unsupported Gate: " + str(gate)) 
        
        # params not set
        if not params:
            params = []        
        
        program += gate(*params, *qubits) 
    
    @staticmethod
    def _create_custom_gate_pyquil(program, matrix, name):
        custom_gate_definition = pyquil_circuit_library.DefGate(name, matrix)
        gate = custom_gate_definition.get_constructor()  
        program += custom_gate_definition  
        return gate
            
