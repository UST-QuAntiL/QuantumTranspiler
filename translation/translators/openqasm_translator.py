from qiskit import QuantumCircuit
from qiskit import transpile
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames

class OpenQasmTranslator(Translator):
    name = TranslatorNames.OPENQASM

    def from_language(self, text: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(text)

    def to_language(self, circuit: QuantumCircuit) -> str:
        return circuit.qasm()
