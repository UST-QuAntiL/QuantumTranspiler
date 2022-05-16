from qiskit import QuantumCircuit
from qiskit.circuit.library import HGate
import cirq
from cirq.contrib.qasm_import import circuit_from_qasm
from qiskit import transpile
from qiskit.providers.ibmq import AccountProvider
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from qiskit import Aer, transpile, IBMQ

class OpenQasmTranslator(Translator):
    name = TranslatorNames.OPENQASM

    def from_language(self, text: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(text)

    def to_language(self, circuit: QuantumCircuit) -> str:
        return circuit.qasm()