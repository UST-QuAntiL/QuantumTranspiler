from translation.translation_handler import TranslationHandler
from translation.translator_names import TranslatorNames
from qiskit import QuantumCircuit


def test_handler():
    handler = TranslationHandler()
    circuit = QuantumCircuit(2, 1)
    circuit.h(0)
    circuit.cx(0, 1)
    qasm = circuit.qasm()
    print(f"QASM: {qasm}")
    translated = handler.translate(qasm, TranslatorNames.OPENQASM, TranslatorNames.BRAKET)
    print(f"Braket: {translated}")
    back_translated = handler.translate(translated, TranslatorNames.BRAKET, TranslatorNames.QUIL)
    print(f"Quil: {back_translated}")

test_handler()