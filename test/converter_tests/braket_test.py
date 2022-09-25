import unittest
import numpy as np
from braket.circuits import Circuit, Observable
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from circuit import CircuitWrapper
from test.converter_tests.test_utility import simulate_qiskit, simulate_braket, intersection, generate_circuit


class BraketTest(unittest.TestCase):

    def test_to_braket_rand(self):
        wrapper = CircuitWrapper()
        for i in range(100):
            with self.subTest(f"Testing circuit {i}."):
                org_circuit = generate_circuit()
                org_counts = simulate_qiskit(org_circuit)
                wrapper.import_circuit(org_circuit)
                t_circuit = wrapper.export_braket()
                t_counts = simulate_braket(t_circuit)
                org_counts_reversed_keys = {key[::-1]: value for key, value in org_counts.items()}
                similarity = intersection(org_counts_reversed_keys, t_counts)
                self.assertGreater(similarity, 0.90)

    def test_from_braket_rand(self):
        wrapper = CircuitWrapper()
        for i in range(100):
            with self.subTest(f"Testing circuit {i}."):
                temp_circuit = generate_circuit()
                wrapper.import_circuit(temp_circuit)
                org_circuit = wrapper.export_braket()
                org_counts = simulate_braket(org_circuit)
                org_ir = wrapper.export_braket_ir()
                wrapper.import_braket_ir(org_ir)
                t_circuit = wrapper.export_qiskit()
                t_counts = simulate_qiskit(t_circuit)
                t_counts_reversed_stripped_keys = {key.replace(" ", "")[::-1]: value for key, value in t_counts.items()}
                similarity = intersection(org_counts, t_counts_reversed_stripped_keys)
                self.assertGreater(similarity, 0.90)

    def test_braket_replacements(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(2)
        org_circuit.u2(np.pi, np.pi, 0)
        org_circuit.u3(np.pi, np.pi, np.pi/2, 1)
        org_circuit.crx(np.pi/2, 0, 1)
        org_circuit.cry(np.pi / 2, 1, 0)
        org_circuit.crz(np.pi / 2, 0, 1)
        org_circuit.measure_all()
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_braket()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_braket(t_circuit)
        org_counts_reversed_keys = {key[::-1]: value for key, value in org_counts.items()}
        similarity = intersection(org_counts_reversed_keys, t_counts)
        print(org_circuit)
        print(org_counts)
        print(t_circuit)
        print(t_counts)
        self.assertGreater(similarity, 0.90)

    def test_qiskit_replacements(self):
        wrapper = CircuitWrapper()
        org_circuit = Circuit()
        org_circuit.v(0)
        org_circuit.vi(1)
        org_circuit.xx(0, 1, 0.15)
        org_circuit.sample(Observable.Z())
        print(org_circuit)
        org_counts = simulate_braket(org_circuit)
        wrapper.import_braket_ir(org_circuit.to_ir().json(indent=4))
        t_circuit = wrapper.export_qiskit()
        t_counts = simulate_qiskit(t_circuit)
        t_counts_reversed_stripped_keys = {key.replace(" ", "")[::-1]: value for key, value in t_counts.items()}
        similarity = intersection(org_counts, t_counts_reversed_stripped_keys)
        self.assertGreater(similarity, 0.90)


    def test_params_defined(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        theta = Parameter('theta')
        org_circuit.rz(theta, 0)
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_braket()
        self.assertEqual(org_circuit.num_parameters, len(t_circuit.parameters))

    def test_params_replacement(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        lam = Parameter('lam')
        phi = Parameter('phi')
        org_circuit.u2(lam, phi, 0)
        wrapper.import_circuit(org_circuit)
        self.assertRaises(ValueError, wrapper.export_braket)

    def test_observable_translation(self):
        wrapper = CircuitWrapper()
        org_circuit = Circuit()
        org_circuit.h(0)
        org_circuit.cnot(0, 1)
        org_circuit.cnot(1, 2)
        org_circuit.sample(Observable.X(), 0)
        org_circuit.sample(Observable.Y(), 1)
        org_circuit.sample(Observable.Z(), 2)
        org_counts = simulate_braket(org_circuit)
        wrapper.import_braket_ir(org_circuit.to_ir().json(indent=4))
        t_circuit = wrapper.export_qiskit()
        t_counts = simulate_qiskit(t_circuit)
        t_counts_reversed_stripped_keys = {key.replace(" ", "")[::-1]: value for key, value in t_counts.items()}
        similarity = intersection(org_counts, t_counts_reversed_stripped_keys)
        self.assertGreater(similarity, 0.90)









