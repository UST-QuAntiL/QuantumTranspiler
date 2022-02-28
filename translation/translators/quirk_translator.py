import cirq
from cirq import Circuit
from qiskit import QuantumCircuit
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm


class QuirkTranslator(Translator):
    name = TranslatorNames.QUIRK

    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.quirk_url_to_circuit(text)
        return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.contrib.quirk.circuit_to_quirk_url(circuit)


if __name__ == '__main__':
    trans = QuirkTranslator()
    circ = QuantumCircuit(2, 1)
    circ.h(0)
    circ.cx(0,1)
    circ.measure(0,0)
    print(trans.to_language(circ))
    print(trans.from_language("https://algassert.com/quirk#circuit={%22cols%22:[[%22H%22,%22H%22,%22H%22],[1,1,%22%E2%80%A2%22,%22X%22],[%22H%22,%22H%22],[%22Swap%22,%22Swap%22,%22%E2%80%A2%22,1,%22X%22],[%22Measure%22,%22Measure%22],[%22Z%22,1,%22H%22],[1,1,%22Measure%22]]}"))