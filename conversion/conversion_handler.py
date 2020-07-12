from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from conversion.mappings.gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate
from qiskit.circuit import Qubit, Clbit, ControlledGate
from qiskit.circuit.exceptions import CircuitError
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import qiskit.circuit as qiskit_circuit_library
from conversion.converter.converter_interface import ConverterInterface
from typing import Tuple, Dict

class ConversionHandler:
    def __init__(self, converter: ConverterInterface.__class__):
        self.converter = converter

    def import_language(self, language: str) -> QuantumCircuit:
        circuit = self.converter.language_to_circuit(language)
        return self.converter.import_circuit(circuit)

    def import_circuit(self, circuit) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        return self.converter.import_circuit(circuit)

    def export_language(self, circuit: QuantumCircuit) -> str:
        (converted_circuit, qreg_mapping, creg_mapping) = self.export_circuit(circuit)
        return (self.converter.circuit_to_language(converted_circuit), qreg_mapping, creg_mapping)

    def export_circuit(self, circuit: QuantumCircuit, recursive=False):
        # method can be executed recursively for subcircuits
        # new converter object for each recursion step is required
        if recursive:
            converter = self.converter.__class__()
        else:
            converter = self.converter
        converter.init_circuit()

        qreg_mapping = {}
        creg_mapping = {}

        # for subcircuits function is called recursively
        for i, qubit in enumerate(circuit.qubits):
            qreg_mapping = converter.create_qreg_mapping(
                qreg_mapping, qubit, i)
        
        creg_mapping = converter.create_creg_mapping(circuit.cregs)

        for instr in circuit.data:            
            qiskit_gate = instr[0]
            qubits = [qreg_mapping[qubit] for qubit in instr[1]]

            if isinstance(qiskit_gate, qiskit_circuit_library.Gate):
                # usual gates
                self._handle_gate_export(converter, qiskit_gate, qubits)

            elif isinstance(instr[0], qiskit_circuit_library.Barrier):
                converter.barrier()
            elif isinstance(instr[0], qiskit_circuit_library.Measure):
                qubit = qreg_mapping[instr[1][0]]
                clbit = creg_mapping[instr[2][0]]
                converter.measure(qubit, clbit)

            elif isinstance(instr[0], qiskit_circuit_library.Instruction):
                # for sub circuits: recursively build circuit
                clbits = [creg_mapping[clbit] for clbit in instr[2]]
                subcircuit = self.export_circuit(
                    instr[0].decompositions[0], recursive=True)[0]
                converter.subcircuit(subcircuit, qubits, clbits)

            else:
                raise NotImplementedError(
                    "Unsupported Instruction: " + str(instr))

        return (converter.circuit, qreg_mapping, creg_mapping)

    def _handle_gate_export(self, converter, qiskit_gate, qubits) -> None:
        # needed for controlled modifier
        is_controlled = False
        num_qubits_base_gate = None

        qiskit_gate_class_name = qiskit_gate.__class__.__name__        

        # if converter is control_capable controlled gates can be represented by using the native control modifier/method
        if (converter.is_control_capable):
            # if 1:1 translation for the gate exists, use the 1:1 translation and do not use the controlled modifier/method
            if not self._in_mappings(converter, qiskit_gate_class_name, "g"):
                # check for controlled gates --> can be handled with controlled modifier/method
                if (isinstance(qiskit_gate, ControlledGate) and qiskit_gate.base_gate):
                    base_gate = qiskit_gate.base_gate
                    num_qubits_base_gate = base_gate.num_qubits
                    qiskit_gate_class_name = base_gate.__class__.__name__
                    # check if base gate has gate entry in gate_mappings (otherwise controlled standard_gate construction is not possible)
                    if (converter.name in gate_mapping_qiskit[qiskit_gate_class_name] and gate_mapping_qiskit[qiskit_gate_class_name][converter.name] and "g" in gate_mapping_qiskit[qiskit_gate_class_name][converter.name]):
                        qiskit_gate_class_name = base_gate.__class__.__name__
                        is_controlled = True

        if qiskit_gate_class_name in gate_mapping_qiskit:
            params = qiskit_gate.params
            # parameter conversion
            for i, param in enumerate(params):
                # parameterized circuit --> add Pyquil Parameter Object (convert from Qiskit Parameter Object)
                if isinstance(param, qiskit_Parameter_expression):
                    params[i] = converter.parameter_expression_conversion(param)
                if isinstance(param, qiskit_Parameter):
                    params[i] = converter.parameter_conversion(param)

            # check if gate/replacement program is defined (else the corresponding matrix might be used)
            if self._in_mappings(converter, qiskit_gate_class_name, "g"):
                gate = self._get_gate(converter, qiskit_gate_class_name, "g")
                converter.gate(gate, qubits, params, is_controlled=is_controlled,
                                num_qubits_base_gate=num_qubits_base_gate)
                return

            # replacement defined (no 1:1 gate available)
            # in this case gate is a circuit generating function defined in name_replacement
            if self._in_mappings(converter, qiskit_gate_class_name, "r"):
                replacement_function = self._get_gate(converter, qiskit_gate_class_name, "r")
                replacement_circuit = replacement_function(*params)
                converter.subcircuit(replacement_circuit, qubits)
                return

            # matrix is defined in gate mappings
            if "matrix" in gate_mapping_qiskit[qiskit_gate_class_name]:
                matrix = gate_mapping_qiskit[qiskit_gate_class_name]["matrix"]
                name = qiskit_gate_class_name
                gate = converter.custom_gate(matrix, name, qubits, params)
                return

        # gate not found in gate mappings, check if gate is defined by a matrix 
        try:
            matrix = qiskit_gate.to_matrix()
            # get name (construction is the same as qiskit's in the qasm method)
            name = qiskit_gate.label if qiskit_gate.label else "unitary" + \
                str(id(qiskit_gate))
            gate = converter.custom_gate(matrix, name, qubits)
        except CircuitError:
            raise NotImplementedError("Unsupported Gate: " + str(gate))

    

    # utility functions
    def _in_mappings(self, converter: ConverterInterface, qiskit_gate_class_name: str, key: str) -> bool:
        """returns True if key is in gate mapping of specific language"""
        # check if gate is defined in mappings
        if qiskit_gate_class_name in gate_mapping_qiskit:
            # check if key is defined in mappings of the gate
            if converter.name in gate_mapping_qiskit[qiskit_gate_class_name] and gate_mapping_qiskit[qiskit_gate_class_name][converter.name] and key in gate_mapping_qiskit[qiskit_gate_class_name][converter.name]:
                return True
            return False
        return False

    def _get_gate(self, converter: ConverterInterface, qiskit_gate_class_name: str, key: str):
        """returns replacement function or gate"""
        return gate_mapping_qiskit[qiskit_gate_class_name][converter.name][key]
