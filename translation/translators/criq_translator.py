import cirq
from cirq import Circuit
from qiskit import QuantumCircuit
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm

class CirqTranslator(Translator):
    name = TranslatorNames.CIRQ

    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.read_json(json_text=text)
        return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.to_json(circuit)