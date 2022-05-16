import cirq
from cirq import Circuit
from qiskit import QuantumCircuit, transpile
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm




class CirqTranslator(Translator):
    name = TranslatorNames.CIRQ
    CIRQ_GATES = ["c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "cswap", "cx", "cy", "cz",
                  "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "sdg", "t", "tdg", "x",
                  "y", "z", "measure"]

    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.read_json(json_text=text)
        return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit = transpile(circuit, basis_gates=self.CIRQ_GATES)
        circuit_cirq: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.to_json(circuit_cirq)