import cirq
from cirq import Circuit
from qiskit import QuantumCircuit, transpile
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm


# Translator for translation from and to Cirq JSON representations
class CirqTranslator(Translator):
    name = TranslatorNames.CIRQ
    CIRQ_GATES = ["c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "cswap", "cx", "cy", "cz",
                  "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "sdg", "t", "tdg", "x",
                  "y", "z", "measure"]

    # Converts a Cirq circuit given as a JSON string into a Qiskit QuantumCircuit object using Cirq's import func.
    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.read_json(json_text=text)
        return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    # Converts a Qiskit QuantumCircuit into a Cirq Circuit given as a JSON string using Cirq's export func.
    def to_language(self, circuit: QuantumCircuit) -> str:
        # Compile circuit to gate set supported by Cirq
        circuit = transpile(circuit, basis_gates=self.CIRQ_GATES)
        circuit_cirq: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.to_json(circuit_cirq)
