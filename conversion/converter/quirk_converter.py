from cirq import Circuit
from cirq.contrib.qasm_import import circuit_from_qasm
from qiskit import QuantumCircuit, ClassicalRegister, transpile
from typing import Tuple, Dict, List
from qiskit.circuit import Qubit, Clbit
from conversion.converter.converter_interface import ConverterInterface
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import cirq


class QuirkConverter(ConverterInterface):
    name = "quirk"
    is_control_capable = True
    QUIRK_GATES = [
        "c3x",
        "c4x",
        "ccx",
        "dcx",
        "h",
        "ch",
        "crx",
        "cry",
        "cswap",
        "cx",
        "cy",
        "cz",
        "i",
        "id",
        "rccx",
        "ms",
        "rc3x",
        "rx",
        "rxx",
        "ry",
        "ryy",
        "rz",
        "rzx",
        "s",
        "sdg",
        "t",
        "tdg",
        "x",
        "y",
        "z",
        "measure",
    ]
    has_internal_export = True

    def import_circuit(
        self, circuit
    ) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        # Try to export this circuit, otherwise optimize further
        try:
            qcircuit = QuantumCircuit.from_qasm_str(circuit.to_qasm())
        except ValueError as e:
            optimizer = cirq.optimizers.ConvertToCzAndSingleGates()
            circuit = optimizer.optimize_circuit(circuit)
            qcircuit = QuantumCircuit.from_qasm_str(circuit.to_qasm())
        qreg_mapping = {}
        for counter, qubit in enumerate(qcircuit.qubits):
            qreg_mapping[counter] = qubit
        creg_mapping = {}
        for counter, clbit in enumerate(qcircuit.clbits):
            creg_mapping[str(counter)] = clbit
        self.program = cirq.quirk_url_to_circuit(circuit)
        return qcircuit, qreg_mapping, creg_mapping

    def export_circuit(self, qcircuit: QuantumCircuit):
        # Compile to basis gates compatible with Cirq and Quirk
        qcircuit = transpile(qcircuit, basis_gates=self.QUIRK_GATES)
        circuit: Circuit = circuit_from_qasm(qcircuit.qasm())
        return circuit

    @property
    def circuit(self):
        return self.program

    def init_circuit(self):
        self.program = cirq.Circuit()

    def create_qreg_mapping(self, qreg_mapping, qubit: Qubit, index: int):
        raise NotImplementedError()

    def create_creg_mapping(self, cregs: List[ClassicalRegister]):
        raise NotImplementedError()

    def gate(self, is_controlled=False):
        raise NotImplementedError()

    def custom_gate(self):
        raise NotImplementedError()

    def parameter_conversion(self, parameter: qiskit_Parameter):
        raise NotImplementedError()

    def parameter_expression_conversion(self, parameter: qiskit_Parameter_expression):
        raise NotImplementedError()

    def barrier(self, qubits):
        raise NotImplementedError()

    def measure(self):
        raise NotImplementedError()

    def subcircuit(self, subcircuit, qubits, clbits):
        raise NotImplementedError()

    def language_to_circuit(self, language: str):
        return cirq.quirk_url_to_circuit(language)

    def circuit_to_language(self, circuit) -> str:
        return cirq.contrib.quirk.circuit_to_quirk_url(circuit)
