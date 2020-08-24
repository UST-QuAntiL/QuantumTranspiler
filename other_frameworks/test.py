from pyquil.quil import Program
from qiskit.circuit.quantumcircuit import QuantumCircuit
from examples.planqk_examples import grover_general_logicalexpression_qiskit, shor_general
from examples.custom_circuits import pyquil_custom, qiskit_custom
from pytket import Circuit
from pytket.qiskit import qiskit_to_tk, tk_to_qiskit
from pytket.pyquil import pyquil_to_tk, tk_to_pyquil

import subprocess

def pytket_qiskit(circuit: QuantumCircuit):
    tk = qiskit_to_tk(circuit)
    new_circuit = tk_to_qiskit(tk)
    print(new_circuit)

def pytket_pyquil(circuit: Program):
    tk = pyquil_to_tk(circuit)
    new_circuit = tk_to_pyquil(tk)
    print(new_circuit)

def quantastica_qiskit(circuit: QuantumCircuit):
    circuit.qasm(filename="temp_files/circuit.qasm")
    subprocess.run(["q-convert", "-i", "temp_files/circuit.qasm", "-s", "qasm", "-o", "temp_files/circuit.quil", "-d", "qiskit", "-w"])

# def quantastica_pyquil(circuit: Program):    
#     circuit.out()
#     subprocess.run(["q-convert", "-i", "temp_files/circuit.quil", "-s", "qasm", "-o", "temp_files/circuit.quil", "-d", "qiskit", "-w"])


def test_circuit():
    circuit = grover_general_logicalexpression_qiskit("(A | B) & (A | ~B) & (~A | B)")
    # circuit = shor_general(3)

    # circuit = qiskit_custom()
    
    # circuit = pyquil_custom()
    return circuit

if __name__ == "__main__":
    circuit = test_circuit()

    quantastica_qiskit(circuit)
    pytket_qiskit(circuit)

    # pytket_pyquil(circuit)