from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pyquil.gates import *
import numpy as np

class ExampleCircuits:    
    @staticmethod
    def qiskit_custom():
        qiskit_circuit = QuantumCircuit(2, 2)
        qiskit_circuit.h(0)
        qiskit_circuit.cx(0, 1)
        qiskit_circuit.measure_all()
        return qiskit_circuit

    @staticmethod
    def pyquil_custom() -> Program:
        pyquil_circuit = Program()
        ro = pyquil_circuit.declare('ro', 'BIT', 3)
        ra = pyquil_circuit.declare('ra', 'BIT', 2)
        pyquil_circuit += H(0)
        pyquil_circuit += CNOT(0, 1)
        pyquil_circuit += RX(np.pi, 2)
        pyquil_circuit += CCNOT(0, 1, 2)
        pyquil_circuit += H(4)
        pyquil_circuit += X(1)
        pyquil_circuit += MEASURE(0, ro[0])
        pyquil_circuit += MEASURE(0, ra[1])
        pyquil_circuit += MEASURE(1, ra[0])    
    
    @staticmethod
    def qiskit_shor() -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(ExampleCircuits.qasm_shor())
        
    @staticmethod
    def qasm_shor() -> str:
        with open("examples/circuit_shor.qasm", "r") as f:
            return f.read()


    @staticmethod
    def quil_shor() -> str:
        with open("examples/circuit_shor.quil", "r") as f:
            return f.read()

    @staticmethod
    def pyquil_shor() -> str:
        return Program(ExampleCircuits.quil_shor())