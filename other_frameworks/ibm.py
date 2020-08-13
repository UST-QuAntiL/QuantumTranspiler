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

def printBloch():
    from qiskit.visualization import plot_bloch_vector
    vector = [0,1,0]
    figure = plot_bloch_vector(vector)
    figure.savefig("other_frameworks/bloch.png")

def printBlochMulti():
    from qiskit import QuantumCircuit, BasicAer, execute
    from qiskit.visualization import plot_bloch_multivector

    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.h(1)
    qc.z(1)
    qc.measure([0, 1], [0, 1])

    backend = BasicAer.get_backend('statevector_simulator')
    job = execute(qc, backend).result()
    figure = plot_bloch_multivector(job.get_statevector(qc), title="New Bloch Multivector")
    plt.show(figure)

if __name__ == "__main__":
    printBlochMulti()
