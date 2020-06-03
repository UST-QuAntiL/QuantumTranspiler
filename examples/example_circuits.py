from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pyquil import Program, get_qc
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pyquil.gates import *
import numpy as np
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from qiskit.extensions import UnitaryGate
from qiskit.quantum_info.random import random_unitary


class ExampleCircuits:
    @staticmethod
    def qiskit_custom():
        qr = QuantumRegister(3, "q")
        qr2 = QuantumRegister(2, "qq")
        cr = ClassicalRegister(5)
        cr2 = ClassicalRegister(2)
        qiskit_circuit = QuantumCircuit(qr, qr2)
        qiskit_circuit.add_register(cr)
        qiskit_circuit.add_register(cr2)
        qiskit_circuit.h(0)
        qiskit_circuit.cx(0, 1)
        qiskit_circuit.cz(qr2[1], qr2[0])

        custom_matrix = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, np.e**(1j*np.pi/2)]
        ], dtype=complex)

        custom_matrix2 = np.array([
            [np.e**(1j*np.pi/2), 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, np.e**(1j*np.pi/2)]
        ], dtype=complex)

        custom_matrix3 = np.array([
            [np.e**(1j*np.pi/2), 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, np.e**(1j*np.pi/2)]
        ], dtype=complex)

        custom_matrix3 = random_unitary(8, seed=42)
        custom_gate = UnitaryGate(custom_matrix)
        custom_gate2 = UnitaryGate(custom_matrix2)
        custom_gate3 = UnitaryGate(custom_matrix3)
        qiskit_circuit.append(custom_gate, qargs=[1,2])
        qiskit_circuit.append(custom_gate2, qargs=[qr[0], qr[1]])
        qiskit_circuit.append(custom_gate3, qargs=[0,1,2])
        qiskit_circuit.rx(np.pi, 0)
        qiskit_circuit.measure_all()
        return qiskit_circuit

    @staticmethod
    def pyquil_custom() -> Program:
        program = Program()
        ro = program.declare('ro', 'BIT', 3)
        ra = program.declare('ra', 'BIT', 2)
        program += H(0)
        program += CNOT(0, 1)
        program += RX(np.pi, 2)
        program += CCNOT(0, 1, 2)
        program += H(4)
        program += X(1)
        sqrt_x = np.array([[0.5+0.5j,  0.5-0.5j],
                           [0.5-0.5j,  0.5+0.5j]])
        sqrt_x_definition = DefGate("SQRT-X", sqrt_x)
        SQRT_X = sqrt_x_definition.get_constructor()
        program += sqrt_x_definition
        program += SQRT_X(0)
        program += MEASURE(0, ro[0])
        program += H(0)
        program += MEASURE(0, ra[1])
        program += MEASURE(1, ra[0])
        return program

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
