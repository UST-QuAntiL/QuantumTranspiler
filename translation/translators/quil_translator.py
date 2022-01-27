from conversion.converter.pyquil_converter import PyquilConverter
from pyquil import Program
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.pyquil import tk_to_pyquil
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames

class QuilTranslator(Translator):
    name= TranslatorNames.QUIL
    converter = PyquilConverter()

    def from_language(self, text: str) -> QuantumCircuit:
        return(self.converter.import_circuit(self.converter.language_to_circuit(text)))[0]

    def to_language(self, circuit: QuantumCircuit) -> str:
        return self.converter.circuit_to_language(tk_to_pyquil(qiskit_to_tk(circuit)))
