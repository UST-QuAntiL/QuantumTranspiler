import cirq
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qiskit import tk_to_qiskit
from pytket.extensions.cirq import tk_to_cirq
from pytket.extensions.cirq import cirq_to_tk
from translation.translators.translator import Translator

class CirqTranslator(Translator):
    name= "cirq_translator"

    def from_language(self, text: str) -> QuantumCircuit:
        circuit = cirq.read_json(text)
        return tk_to_qiskit(cirq_to_tk(self.ir_to_circuit(circuit)))


    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit = tk_to_cirq(qiskit_to_tk(circuit))
        return cirq.to_json(circuit)