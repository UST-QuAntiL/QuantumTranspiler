import cirq
from cirq import Circuit
from qiskit import QuantumCircuit, transpile
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from cirq.contrib.qasm_import import circuit_from_qasm


# Translator for translation from and to Quirk URLs
class QuirkTranslator(Translator):
    name = TranslatorNames.QUIRK
    QUIRK_GATES = ["c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "cswap", "cx", "cy", "cz",
                   "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "sdg", "t", "tdg", "x",
                   "y", "z", "measure"]

    # Converts a Quirk circuit given as an URL into a Qiskit QuantumCircuit object using Cirq's compatibility with both
    # Quirk and OpenQASM
    def from_language(self, text: str) -> QuantumCircuit:
        circuit: Circuit = cirq.quirk_url_to_circuit(text)
        # Try to export this circuit, otherwise optimize further
        try:
            return QuantumCircuit.from_qasm_str(circuit.to_qasm())
        except ValueError as e:
            optimizer = cirq.optimizers.ConvertToCzAndSingleGates()
            circuit = optimizer.optimize_circuit(circuit)
            return QuantumCircuit.from_qasm_str(circuit.to_qasm())

    # Converts a Qiskit QuantumCircuit into a Cirq Circuit given as a JSON string using Cirq's compatibility with both
    # Quirk and OpenQASM
    def to_language(self, circuit: QuantumCircuit) -> str:
        # Compile to basis gates compatible with Cirq and Quirk
        circuit = transpile(circuit, basis_gates=self.QUIRK_GATES)
        circuit_cirq: Circuit = circuit_from_qasm(circuit.qasm())
        return cirq.contrib.quirk.circuit_to_quirk_url(circuit_cirq)
