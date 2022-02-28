from qiskit import QuantumCircuit, ClassicalRegister
from typing import Tuple, Dict, List
from qiskit.circuit import Qubit, Clbit
from conversion.converter.converter_interface import ConverterInterface
from translation.translators.quirk_translator import QuirkTranslator
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import cirq


class QuirkConverter(ConverterInterface):
    name = "quirk"
    is_control_capable = True
    translator = QuirkTranslator()

    def import_circuit(self, circuit) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        qkcircuit: QuantumCircuit = self.translator.from_language(circuit)
        qreg_mapping = {}
        for counter, qubit in enumerate(qkcircuit.qubits):
            qreg_mapping[counter] = qubit
        creg_mapping = {}
        for counter, clbit in enumerate(qkcircuit.clbits):
            creg_mapping[str(counter)] = clbit
        self.program = cirq.quirk_url_to_circuit(circuit)
        return qkcircuit, qreg_mapping, creg_mapping

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
        raise NotImplementedError()

    def circuit_to_language(self, circuit) -> str:
        raise NotImplementedError()


