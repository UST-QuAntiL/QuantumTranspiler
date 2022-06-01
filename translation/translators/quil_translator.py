from conversion.converter.pyquil_converter import PyquilConverter
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.pyquil import tk_to_pyquil
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames


# Translator for translation from and to Quil. Here for completeness’s sake, not actually used in any functionality
class QuilTranslator(Translator):
    name = TranslatorNames.QUIL
    converter = PyquilConverter()

    # Converts a Quil string into a Qiskit QuantumCircuit object using the PyquilConverter
    def from_language(self, text: str) -> QuantumCircuit:
        return(self.converter.import_circuit(self.converter.language_to_circuit(text)))[0]

    # Converts a Qiskit QuantumCircuit into a Quil string object using the PyquilConverter
    def to_language(self, circuit: QuantumCircuit) -> str:
        return self.converter.circuit_to_language(tk_to_pyquil(qiskit_to_tk(circuit)))
