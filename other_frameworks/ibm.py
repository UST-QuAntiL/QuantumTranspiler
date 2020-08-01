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
    qc = QuantumCircuit(5)
    qc.unitary(np.array([[ 0.14480819+0.1752384j , -0.51892816-0.52424259j,
        -0.14955858+0.312755j  ,  0.16913481-0.50538631j],
       [-0.92717439-0.08785062j, -0.11260331-0.1818585j ,
         0.12255872+0.09640286j, -0.24498509-0.05045841j],
       [-0.00798428-0.20355071j, -0.38932055-0.05180925j,
         0.26051706+0.32864025j,  0.44517308+0.65589332j],
       [ 0.03137922+0.19613952j,  0.4980475 +0.08846049j,
         0.34078865+0.750661j  ,  0.01464807-0.15755843j]]) ,[0, 1], label='unitary_2qubits')

    print(qc)
