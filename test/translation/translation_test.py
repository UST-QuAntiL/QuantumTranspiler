import numpy as np
from translation.translators.quil_translator import QuilTranslator
from translation.translators.braket_translator import BraketTranslator
from translation.translators.qsharp_translator import QsharpTranslator
from pyquil import Program
from pyquil.gates import *
from qiskit import QuantumCircuit
from braket.circuits.observable import Observable
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qiskit import tk_to_qiskit
from pytket.extensions.braket import tk_to_braket
from pytket.extensions.braket import braket_to_tk
from translation.translators.translator import Translator
from braket.ir.jaqcd import Program as BProgram
from braket.circuits import Circuit
import qsharp

def test_pyquil():
    example = Program()
    example += H(0)
    example += CNOT(0, 1)

    quil_ex = example.out()

    print(f"Quil:\n {quil_ex}")

    translator = QuilTranslator()
    qasm = translator.from_language(quil_ex).qasm()

    print(f"Qasm:\n {qasm}")

    circuit = QuantumCircuit.from_qasm_str(qasm)


    quil_back = translator.to_language(circuit)

    print(f"Quil:\n {quil_back}")

def test_braket():
    transl = BraketTranslator()
    K0 = np.eye(4) * np.sqrt(0.9)
    K1 = np.kron([[1., 0.], [0., 1.]], [[0., 1.], [1., 0.]]) * np.sqrt(0.1)
    print(f"Matrices Original: [{K0}, {K1}")
    h: Circuit = Circuit().cphaseshift(0, 1, 0.15).h(0).iswap(0,2).rx(0, 0.15).expectation(
        observable=Observable.H(), target=0)
    print(f"Braket: {h}")
    print(f"IR: {h.to_ir()}")
    quisk = transl.from_language(h.to_ir().json(indent=2))
    print(f"quisk: {quisk}")
    hback = transl.to_language(quisk)
    print(f"IR: {hback}")
    print(f"Braket: +{transl.ir_to_circuit(BProgram.parse_raw(hback))}")

def test_qsharp():
    circuit = QuantumCircuit(3, 1)
    circuit.h(0)
    circuit.cx(1, 2)
    circuit.rx(1/4, 0)
    circuit.swap(0, 1)
    print(circuit)
    trans = QsharpTranslator()
    sharp = trans.to_language(circuit)
    print(sharp)
    print(trans.from_language(sharp))

    trans.from_language("""
    operation Qrng() : Result {
        use q = Qubit();
        H(q);
        return MResetZ(q);
    }
    """)

test_qsharp()