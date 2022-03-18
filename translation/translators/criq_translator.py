import cirq
from cirq import Circuit
from qiskit import QuantumCircuit
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm
import cirq_google as cg

class CirqTranslator(Translator):
    name = TranslatorNames.CIRQ

    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.read_json(json_text=text)
        return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.to_json(circuit)

if __name__ == '__main__':
    for gate in cg.FSIM_GATESET.supported_internal_types():
        print(gate)

    for gate in cg.SYC_GATESET.supported_internal_types():
        print(gate)