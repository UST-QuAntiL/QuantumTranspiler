from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
import numpy as np
from circuit.circuit_wrapper import CircuitWrapper
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from examples import *
import qiskit.circuit.library.standard_gates as Gates
from qiskit.circuit import Parameter

class TestCircuitWrapper:
    def test_pyquil_import(self):
        wrapper = CircuitWrapper(pyquil_program=pyquil_custom())
        show_figure(wrapper.circuit)

    def test_pyquil_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom())
        pyquil = wrapper.export_pyquil()
        print(pyquil)

    def test_qasm_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom_unroll())
        qasm = wrapper.export_qasm()
        print(qasm)

    def test_decompose(self):
        print(qiskit_custom_unroll())
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom_unroll())
        wrapper.decompose_to_standard_gates()
        print(wrapper.circuit)
        
    def test_unroll(self):
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom_unroll())
        wrapper.unroll_rigetti()
        # wrapper.unroll(["u3", "u2", "cz", "u1"])
        # wrapper.unroll(["rz", "rx", "cz"])
        # wrapper.unroll(["rx", "cz"])

if __name__ == "__main__":
    test = TestCircuitWrapper()
    test.test_unroll()