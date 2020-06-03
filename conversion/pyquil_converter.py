from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from pyquil import Program
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from circuit.qiskit_utility import show_figure
from conversion.gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate
from qiskit.circuit import Qubit, Clbit 
import qiskit.circuit as qiskit_library
from pyquil.gates import NOP, MEASURE
from qiskit.circuit.exceptions import CircuitError

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
            if isinstance(instr, Declare):
                if instr.memory_type != "BIT":
                    raise NotImplementedError(
                        "Unsupported memory type:" + str(instr.memory_type))

                cr = ClassicalRegister(instr.memory_size, instr.name)
                for i in range(instr.memory_size):
                    creg_mapping[instr.name + "_" + str(i)] = cr[i]
                circuit.add_register(cr)

            elif isinstance(instr, Gate):
                PyquilConverter._handle_gate_import(circuit, instr, program, qreg_mapping)

            elif isinstance(instr, Measurement):
                qubit = qreg_mapping[instr.qubit.index]
                clbit = creg_mapping[instr.classical_reg.name + "_" + str(instr.classical_reg.offset)]
                circuit.measure(qubit, clbit)

            elif isinstance(instr, Pragma):
                # http://docs.rigetti.com/en/stable/basics.html#pragmas
                # pragmas do not change the semantics of a program
                # e.g. rewiring and delays
                # can be alternatively implemented with qiskit (https://qiskit.org/documentation/stubs/qiskit.pulse.Delay.html)
                continue
            elif isinstance(instr, NOP):                
                continue
            elif isinstance(instr, Halt):
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
            instr_qiskit = instr_qiskit_class(*params)

        # custom gates
        else:
            gate_found = False
            for gate in program.defined_gates:
                if gate.name == instr.name:
                    gate_found = True
                    instr_qiskit = UnitaryGate(gate.matrix, label=gate.name)
            
            if not gate_found:  
                raise NotImplementedError("Unsupported Gate: " + str(instr))                
            

        # get the qubits on which the instruction operates
        qargs = [qreg_mapping[qubit.index]
                    for qubit in instr.qubits]
        circuit.append(instr_qiskit, qargs=qargs)

      


    @staticmethod
    def export_quil(circuit: QuantumCircuit) -> str:
        program = PyquilConverter.export_pyquil(circuit)
        return program.out()

    @staticmethod
    def export_pyquil(circuit: QuantumCircuit) -> Program:        
        program = Program()
        qreg_mapping = {}
        creg_mapping = {}  

        for i, qubit in enumerate(circuit.qubits):
            qreg_mapping[qubit] = i

        for cr in circuit.cregs:
            creg_pyquil = program.declare(cr.name, 'BIT', cr.size)
            for i, clbit in enumerate(cr):
                creg_mapping[clbit] = creg_pyquil[i]

        for instr in circuit.data:
            qiskit_gate = instr[0]
            qubits = [qreg_mapping[qubit] for qubit in instr[1]]
            
            if isinstance(qiskit_gate, qiskit_library.Gate):
                # usual gates
                if qiskit_gate.__class__.__name__ in gate_mapping_qiskit:
                    gate = gate_mapping_qiskit[qiskit_gate.__class__.__name__]["pyquil"]
                    print(qiskit_gate.params)
                
                # by matrix defined gates
                else:
                    try:
                        matrix = qiskit_gate.to_matrix()     
                        # get name (construction is the same as qiskit's in the qasm method)
                        name = qiskit_gate.label if qiskit_gate.label else "unitary" + str(id(qiskit_gate)) 
                        custom_gate_definition = DefGate(name, matrix)
                        gate = custom_gate_definition.get_constructor()  
                        program += custom_gate_definition  
                        
                    except CircuitError:
                        raise NotImplementedError("Unsupported Gate: " + str(gate)) 

                program += gate(*qubits) 
                
            elif isinstance(instr[0], qiskit_library.Barrier):
                # no pyquil equivalent
                continue
            elif isinstance(instr[0], qiskit_library.Measure):
                qubit = qreg_mapping[instr[1][0]]
                cbit = creg_mapping[instr[2][0]]
                program += MEASURE(qubit, cbit)

        return program

        # creg_sizes = {}
        # for b in tkcirc.bits:
        #     if len(b.index) != 1:
        #         raise NotImplementedError("PyQuil registers must use a single index")
        #     if (b.reg_name not in creg_sizes) or (b.index[0] >= creg_sizes[b.reg_name]):
        #         creg_sizes.update({b.reg_name: b.index[0] + 1})
        # cregmap = {}
        # for reg_name, size in creg_sizes.items():
        #     name = reg_name
        #     if name == "c":
        #         name = "ro"
        #     quil_reg = p.declare(name, "BIT", size)
        #     cregmap.update({reg_name: quil_reg})
        # if active_reset:
        #     p.reset()
        # measures = []
        # measured_qubits = []
        # used_bits = []
        # for command in tkcirc:
        #     op = command.op
        #     optype = op.type
        #     if optype == OpType.Measure:
        #         qb = Qubit_(command.args[0].index[0])
        #         if qb in measured_qubits:
        #             raise NotImplementedError(
        #                 "Cannot apply gate on qubit " + qb.__repr__() + " after measurement"
        #             )
        #         bit = command.args[1]
        #         b = cregmap[bit.reg_name][bit.index[0]]
        #         measures.append(Measurement(qb, b))
        #         measured_qubits.append(qb)
        #         used_bits.append(bit)
        #         continue
        #     elif optype == OpType.Barrier:
        #         continue  # pyQuil cannot handle barriers
        #     qubits = [Qubit_(qb.index[0]) for qb in command.args]
        #     for qb in qubits:
        #         if qb in measured_qubits:
        #             raise NotImplementedError(
        #                 "Cannot apply gate on qubit " + qb.__repr__() + " after measurement"
        #             )
        #     try:
        #         gatetype = _known_quil_gate_rev[optype]
        #     except KeyError as error:
        #         raise NotImplementedError(
        #             "Cannot convert tket Op to pyQuil gate: " + op.get_name()
        #         ) from error
        #     params = [float((p * pi).evalf()) for p in op.params]
        #     g = Gate(gatetype, params, qubits)
        #     p += g
        # for m in measures:
        #     p += m
        # if return_used_bits:
        #     return p, used_bits
        # return p
            
