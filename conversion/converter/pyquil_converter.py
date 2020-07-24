from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
import pyquil.quilbase as pyquil_circuit_library
from circuit.qiskit_utility import show_figure
from conversion.mappings.gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate
from qiskit.circuit import Qubit, Clbit
from pyquil.gates import NOP, MEASURE
from qiskit.circuit.exceptions import CircuitError
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import qiskit.circuit as qiskit_circuit_library
from conversion.converter.converter_interface import ConverterInterface
from typing import Tuple, Dict, List
import numpy as np

class PyquilConverter(ConverterInterface):  
    name = "pyquil"
    is_control_capable = True

    def import_circuit(self, circuit: Program) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        program = circuit
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
                self._handle_gate_import(circuit, instr, program, qreg_mapping)

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

    def _handle_gate_import(self, circuit, instr, program, qreg_mapping) -> None:     
        modifiers = instr.modifiers   
        if instr.name in gate_mapping_pyquil:                         
            # get the instruction
            if "g" in gate_mapping_pyquil[instr.name]:
                instr_qiskit_class = gate_mapping_pyquil[instr.name]["g"]
            # replacement circuit
            elif "r" in gate_mapping_pyquil[instr.name]:
                instr_qiskit_class = gate_mapping_pyquil[instr.name]["r"]
            else:
                raise NameError("Gate defined in gate mapping but neither gate nor replacement circuit is given: " + str(instr))
            # TODO check if division by pi is necessary (pytket does this)
            params = instr.params
            for i, param in enumerate(params):
                # parameterized circuit --> add Qiskit Parameter Object (convert from Pyquil Parameter Object)
                if isinstance(param, pyquil_Parameter):
                    params[i] = qiskit_Parameter(param.name)

            # reverse needed, because the first operation is at the end of the list (for whatever reason)
            # and modifier are not always commutative            

            instr_qiskit = instr_qiskit_class(*params)   
        # custom gates
        else:
            gate_found = False
            for gate in program.defined_gates:
                if gate.name == instr.name:
                    gate_found = True
                    if gate.parameters:   
                        # no possibility to bind pyquil parameter to value before execution on a device (like the qiskit equivalent assign_parameters)
                        # and no possibility to define parametric custom gates in qiskit
                        raise NotImplementedError("Cannot convert parameterized custom gates to Qiskit: " + str(instr))
                        # for i, param in enumerate(instr.params):                            
                            # if isinstance(param, pyquil_Parameter):
                            #     raise NotImplementedError("Cannot convert parameterized custom gates (with general parameter) to Qiskit: " + str(instr))  
                            # if isinstance(gate.parameters[i], pyquil_Parameter):
                            #     raise NotImplementedError("Cannot convert parameterized custom gates to Qiskit: " + str(instr))     
                        
                    else:
                        instr_qiskit = UnitaryGate(gate.matrix, label=gate.name)
            
            if not gate_found:  
                raise NotImplementedError("Unsupported Gate: " + str(instr))                
            
        for modifier in reversed(modifiers):
                if modifier == "CONTROLLED":
                    instr_qiskit = instr_qiskit.control(1)
                elif modifier == "DAGGER":
                    instr_qiskit = instr_qiskit.inverse()
                else:
                    raise NotImplementedError("Unsupported Modifier: " + str(modifier))

        # get the qubits on which the instruction operates
        qargs = [qreg_mapping[qubit.index]
                    for qubit in instr.qubits]
        circuit.append(instr_qiskit, qargs=qargs)


    def init_circuit(self):
        self.program = Program()

    def create_qreg_mapping(self, qreg_mapping, qubit: Qubit, index: int):
        qreg_mapping[qubit] = index
        return qreg_mapping

    def create_creg_mapping(self, cregs: List[ClassicalRegister]):
        total_size = 0
        creg_mapping = {}
        for cr in cregs:
            total_size += cr.size

        creg_pyquil = self.program.declare("ro", 'BIT', total_size)
        for cr in cregs:
            for i, clbit in enumerate(cr):                
                creg_mapping[clbit] = creg_pyquil[i]
        
        return creg_mapping
        

    def gate(self, gate, qubits, params, is_controlled = False, num_qubits_base_gate = None):
        if is_controlled:
            control_qubits = qubits[:(len(qubits) - num_qubits_base_gate)]
            qubits = qubits[(len(qubits) - num_qubits_base_gate):]            
            self.program += gate(*params, *qubits).controlled(control_qubits) 
        else:
            self.program += gate(*params, *qubits)        

    def custom_gate(self, matrix, name, qubits, params = []):
        custom_gate_definition = pyquil_circuit_library.DefGate(name, matrix)
        gate = custom_gate_definition.get_constructor()  
        self.program += custom_gate_definition 
        self.program += gate(*params, *qubits) 

    def parameter_conversion(self, parameter: qiskit_Parameter):
        return pyquil_Parameter(parameter.name)

    def parameter_expression_conversion(self, parameter: qiskit_Parameter_expression):
        if len(parameter.parameters) == 0:  
            return float(parameter._symbol_expr)
        else:
            raise NotImplementedError("Parameter Expressions with unbound parameters are not supported: " + str(parameter))     


    def barrier(self):
        # no pyquil equivalent
        return

    def measure(self, qubit, clbit):
        self.program += MEASURE(qubit, clbit)

    def subcircuit(self, subcircuit: Program, qubits, clbits = None):
        qreg_mapping = {}

        # inits the qreg_mapping that maps a qubit in the subcircuit to the in qubits specified target qubit
        for i, qubit in enumerate(subcircuit.get_qubits()):
            qreg_mapping[qubit] = qubits[i]

        # add custom gate definition if the definition does not exist yet
        for def_gate in subcircuit.defined_gates:
            if  not(def_gate in self.program.defined_gates):
                self.program += def_gate
                
        for instr in subcircuit.instructions:     
            if isinstance(instr, pyquil_circuit_library.Gate):    
                # sets the correct qubit index for the gate in the program (defined by qreg_mapping) 
                for qubit in instr.qubits:
                    qubit.index = qreg_mapping[qubit.index]
                self.program += instr

            elif isinstance(instr, pyquil_circuit_library.Measurement):
                raise NotImplementedError("Measurement in subcircuits not supported (pyquil_converter): " + str(instr))  
            else:
                 raise NotImplementedError("Operation that is not supported in subcircuits (pyquil_converter): " + str(instr))              

    def language_to_circuit(self, language: str):
        return Program(language)

    def circuit_to_language(self, circuit) -> str:
        return circuit.out()  

    @property
    def circuit(self):
        return self.program

            
