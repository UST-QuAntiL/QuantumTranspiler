from cirq import Circuit
from cirq.contrib.qasm_import import circuit_from_qasm
from qiskit import QuantumCircuit, ClassicalRegister, transpile
from typing import Tuple, Dict, List
from qiskit.circuit import Qubit, Clbit
from conversion.converter.converter_interface import ConverterInterface
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import cirq


class CirqConverter(ConverterInterface):
    CIRQ_GATES = ["ccx", "h", "ch", "cswap", "cx", "cy", "cz",
                  "i", "id", "rx", "ry", "rz", "s", "sdg", "t", "tdg", "x",
                  "y", "z", "measure"]
    name = "cirq"
    is_control_capable = True
    has_internal_export = True

    def import_circuit(self, circuit) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        self.program = circuit
        qcircuit: QuantumCircuit = QuantumCircuit.from_qasm_str(circuit.to_qasm())
        qreg_mapping = {}
        for counter, qubit in enumerate(qcircuit.qubits):
            qreg_mapping[counter] = qubit
        creg_mapping = {}
        for counter, clbit in enumerate(qcircuit.clbits):
            creg_mapping[str(counter)] = clbit
        return qcircuit, qreg_mapping, creg_mapping

    def export_circuit(self, qcircuit: QuantumCircuit):
        qcircuit = transpile(qcircuit, basis_gates=self.CIRQ_GATES)
        qcircuit.data = [gate for gate in qcircuit.data if not (gate[0].name == "barrier")]
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
        return cirq.read_json(json_text=language)

    def circuit_to_language(self, circuit) -> str:
        return cirq.to_json(circuit)


