from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ
from qiskit.compiler import transpile
from qiskit.transpiler import PassManager
from qiskit.converters import dag_to_circuit
import matplotlib.pyplot as plt
from qiskit.dagcircuit import DAGCircuit
from qiskit.converters import circuit_to_dag
from qiskit.tools.visualization import dag_drawer
from qiskit.circuit.library.standard_gates import CHGate, U2Gate, CXGate, HGate, XGate, CCXGate, CZGate
from qiskit.extensions import UnitaryGate
from qiskit.transpiler import passes
from qiskit.compiler import transpile
from qiskit.transpiler import PassManager
from qiskit.transpiler.passes import Decompose, Unroller
import numpy as np
import logging
from qiskit.test.mock import FakeTenerife
from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel
from qiskit.circuit import Gate
from qiskit.quantum_info.operators import Operator
from qiskit.quantum_info.random import random_unitary
from qiskit.transpiler.passes import Unroll3qOrMore, Unroller, Optimize1qGates
import qiskit.circuit.library.standard_gates as qiskit_gate
import pyquil.gates as pyquil_gates
from examples import *
from qiskit.quantum_info.synthesis.two_qubit_decompose import TwoQubitBasisDecomposer


def circuit():
    circ = QuantumCircuit(3)
    circ.x(0)
    circ.h(0)
    circ.toffoli(0, 1, 2)
    circ.u3(np.pi, np.pi, np.pi, 0)
    show_figure(circ)
    return circ


def unroll3q():
    unitary = random_unitary(16, seed=42)
    qr = QuantumRegister(4, 'qr')
    circuit = QuantumCircuit(qr)
    circuit.unitary(unitary, [0, 1, 2, 3])
    dag = circuit_to_dag(circuit)
    pass_ = Unroll3qOrMore()
    dag = pass_.run(dag)
    pass_ = Unroller(['u1', 'u2', 'u3', 'cx', 'ccx'])
    dag = pass_.run(dag)
    pass_ = Optimize1qGates()
    dag = pass_.run(dag)
    after_circuit = dag_to_circuit(dag)
    show_figure(after_circuit)


def dag_default(circ):
    dag = circuit_to_dag(circ)
    dag_drawer(dag, filename="dag.png")

    pass_ = Unroller(['u1', 'u2', 'u3', 'cz'])
    dag = pass_.run(dag)

    c = dag_to_circuit(dag)
    show_figure(c)


if __name__ == "__main__":

    # logging.basicConfig(level='DEBUG')
    # logging.getLogger('qiskit.transpiler').setLevel('INFO')

    cz_matrix = np.array([[1, 0, 0, 0],
                   [0, 1, 0, 0],
                   [0, 0, 1, 0],
                   [0, 0, 0, -1]], dtype=complex)
    cz_gate = UnitaryGate(cz_matrix)

    custom_matrix1 = np.array([
        [np.e**(1j*np.pi/2), 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, np.e**(1j*np.pi/2)]
    ], dtype=complex)
    # custom_matrix1 = random_unitary(4, seed=42)
    custom_gate1 = UnitaryGate(custom_matrix1)
    print(custom_gate1.definition)
    two_qubit_cz_decompose = TwoQubitBasisDecomposer(cz_gate)
    custom_gate1.definition = two_qubit_cz_decompose(
        custom_gate1.to_matrix()).data
    print(custom_gate1.definition)
    # gate =
