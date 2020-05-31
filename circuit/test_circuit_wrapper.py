from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pyquil.gates import *
import numpy as np
from circuit.circuit_wrapper import CircuitWrapper
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate

class TestCircuitWrapper:
    def __init__(self):
        self.qiskit_circuit_create()
        self.pyquil_circuit_create()
        self.shor_qiskit_create()
        self.shor_pyquil_create()
        self.shor_quil_create()

    def qiskit_circuit_create(self):
        self.qiskit_circuit = QuantumCircuit(2, 2)
        self.qiskit_circuit.h(0)
        self.qiskit_circuit.cx(0, 1)
        self.qiskit_circuit.measure_all()
        self.qasm = self.qiskit_circuit.qasm()

    def pyquil_circuit_create(self):
        self.pyquil_circuit = Program()
        ro = self.pyquil_circuit.declare('ro', 'BIT', 3)
        ra = self.pyquil_circuit.declare('ra', 'BIT', 2)
        self.pyquil_circuit += H(0)
        self.pyquil_circuit += CNOT(0, 1)
        self.pyquil_circuit += RX(np.pi, 2)
        self.pyquil_circuit += CCNOT(0, 1, 2)
        sqrt_x = np.array([[ 0.5+0.5j,  0.5-0.5j],
                   [ 0.5-0.5j,  0.5+0.5j]])
        sqrt_x_definition = DefGate("SQRT-X", sqrt_x)
        self.pyquil_circuit += sqrt_x_definition
        SQRTX = sqrt_x_definition.get_constructor()
        self.pyquil_circuit += SQRTX(0)

        self.pyquil_circuit += H(4)
        self.pyquil_circuit += X(1)
        self.pyquil_circuit += MEASURE(0, ro[0])
        self.pyquil_circuit += MEASURE(0, ra[1])
        self.pyquil_circuit += MEASURE(1, ra[0])

    def shor_pyquil_create(self):
        p = Program()
        ro = p.declare('ro', memory_type='BIT', memory_size=3)
        p.inst(H(0))
        p.inst(H(1))
        p.inst(H(2))
        p.inst(H(1))
        p.inst(CNOT(2, 3))
        p.inst(CPHASE(0, 1, 0))
        p.inst(CNOT(2, 4))
        p.inst(H(0))
        p.inst(CPHASE(0, 1, 2))
        p.inst(CPHASE(0, 0, 2))
        p.inst(H(2))
        p.inst(MEASURE(0, ro[0]))
        p.inst(MEASURE(1, ro[1]))
        p.inst(MEASURE(2, ro[2]))

        self.shor_pyquil = p

    def shor_qiskit_create(self):
        with open("circuit_shor.qasm", "r") as f:
            self.shor_qasm = f.read()
            self.shor_qiskit = QuantumCircuit.from_qasm_str(self.shor_qasm)

    def shor_quil_create(self):
        with open("circuit_shor.quil", "r") as f:
            self.shor_quil = f.read()

    def test_pyquil_import(self):
        print(self.pyquil_circuit)
        wrapper = CircuitWrapper(pyquil_program=self.pyquil_circuit)
        show_figure(wrapper.circuit) 

    def test_pyquil_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=self.qiskit_circuit)
        pyquil = wrapper.export_pyquil()
        print(pyquil)

if __name__ == "__main__":
    test = TestCircuitWrapper()
    test.test_pyquil_import()
