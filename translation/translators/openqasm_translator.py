from qiskit import QuantumCircuit
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames


# Translator for translation from and to OpenQASM. Here for completeness’s sake, not actually used in any functionality
class OpenQasmTranslator(Translator):
    name = TranslatorNames.OPENQASM

    # Converts OpenQASM into a Qiskit circuit using native import
    def from_language(self, text: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(text)

    # Converts a Qiskit QuantumCircuit to OpenQASM using native export
    def to_language(self, circuit: QuantumCircuit) -> str:
        return circuit.qasm()