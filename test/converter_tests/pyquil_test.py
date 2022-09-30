import unittest
import numpy as np
from pyquil import Program
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from pyquil.gates import *
from pyquil.quilatom import Parameter as PyQuilParameter
from circuit import CircuitWrapper
from test.converter_tests.test_utility import generate_circuit, intersection, simulate_qiskit, simulate_pyquil


# Naming of tests is test_"tested property"_"target language"


class PyQuilTest(unittest.TestCase):

    def test_rand_pyquil(self):
        wrapper = CircuitWrapper()
        for i in range(10):
            with self.subTest(f"Testing circuit {i}."):
                org_circuit = generate_circuit()
                org_counts = simulate_qiskit(org_circuit)
                wrapper.import_circuit(org_circuit)
                t_circuit = wrapper.export_pyquil()
                t_counts = simulate_pyquil(t_circuit)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(similarity, 0.90, str(org_circuit.qasm()) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(t_counts))

    def test_rand_qiskit(self):
        wrapper = CircuitWrapper()
        for i in range(10):
            with self.subTest(f"Testing circuit {i}."):
                temp_circuit = generate_circuit()
                wrapper.import_circuit(temp_circuit)
                org_circuit = wrapper.export_pyquil()
                org_counts = simulate_pyquil(org_circuit)
                wrapper.import_pyquil_circuit(org_circuit)
                t_circuit = wrapper.export_qiskit()
                t_counts = simulate_qiskit(t_circuit)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(similarity, 0.90)

    def test_replacements_pyquil(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(2)
        org_circuit.u2(np.pi, np.pi, 0)
        org_circuit.u3(np.pi, np.pi, np.pi/2, 1)
        org_circuit.crx(np.pi/2, 0, 1)
        org_circuit.cry(np.pi / 2, 1, 0)
        org_circuit.crz(np.pi / 2, 0, 1)
        org_circuit.cu3(np.pi, np.pi, np.pi/2, 0, 1)
        org_circuit.ch(1, 0)
        org_circuit.measure_all()
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_pyquil()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_pyquil(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90)

    def test_replacements_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = Program()
        org_circuit += X(0)
        org_circuit += CPHASE00(np.pi/2, 0, 1)
        org_circuit += CPHASE01(np.pi/4, 1, 0)
        org_circuit += CPHASE10(np.pi/2, 0, 1)
        org_circuit += PSWAP(np.pi/2, 0, 1)
        org_circuit += CNOT(1, 2).controlled(0)
        org_circuit.measure_all()
        org_counts = simulate_pyquil(org_circuit)
        wrapper.import_pyquil_circuit(org_circuit)
        t_circuit = wrapper.export_qiskit()
        t_counts = simulate_qiskit(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90)

    def test_params_pyquil(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        theta = Parameter('theta')
        org_circuit.rz(theta, 0)
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_pyquil()
        instr = t_circuit.instructions[1]
        self.assertEqual(len(org_circuit.parameters), len(instr.params))

    def test_params_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = Program()
        theta = PyQuilParameter("theta")
        org_circuit += RX(theta, 1)
        wrapper.import_pyquil_circuit(org_circuit)
        t_circuit = wrapper.export_qiskit()
        instr = org_circuit.instructions[0]
        self.assertEqual(len(instr.params), len(t_circuit.parameters))


