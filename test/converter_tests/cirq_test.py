import unittest

import cirq
import numpy as np
import qiskit.circuit.library.standard_gates
import sympy
from cirq import Circuit
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit.qasm import QasmError

from circuit import CircuitWrapper
from test.converter_tests.test_utility import generate_circuit, simulate_qiskit, intersection, simulate_cirq, \
    generate_circuit_cirq


# Naming of tests is test_"tested property"_"target language"


class MyTestCase(unittest.TestCase):

    def test_rand_cirq(self):
        wrapper = CircuitWrapper()
        for i in range(100):
            with self.subTest(f"Testing circuit {i}."):
                org_circuit = generate_circuit()
                org_counts = simulate_qiskit(org_circuit)
                wrapper.import_circuit(org_circuit)
                t_json = wrapper.export_cirq_json()
                t_circuit = cirq.read_json(json_text=t_json)
                t_counts = simulate_cirq(t_circuit, reorder=True)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(similarity, 0.90, str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(t_counts))

    def test_rand_qiskit(self):
        wrapper = CircuitWrapper()
        for i in range(100):
            with self.subTest(f"Testing circuit {i}."):
                org_circuit = generate_circuit_cirq()
                org_counts = simulate_cirq(org_circuit)
                wrapper.import_cirq_circuit(org_circuit)
                t_circuit = wrapper.export_qiskit()
                t_counts = simulate_qiskit(t_circuit)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(similarity, 0.90, str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(t_counts))

    def test_no_direct_translation_cirq(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(3)
        org_circuit.h(0)
        org_circuit.cx(0, 1)
        org_circuit.cx(1, 2)
        org_circuit.crx(np.pi/2, 0, 1)
        org_circuit.dcx(1, 2)
        org_circuit.rccx(0, 1, 2)
        org_circuit.ms(np.pi/4, [0, 2])
        org_circuit.measure_all()
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_cirq()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_cirq(t_circuit, reorder=True)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90,
                           str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(
                               t_counts))

    def test_controlled_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = Circuit()
        qubits = cirq.LineQubit.range(3)
        org_circuit.append(cirq.H(qubits[0]))
        org_circuit.append(cirq.H(qubits[1]))
        org_circuit.append(cirq.X(qubits[2]).controlled_by(qubits[1]).controlled_by(qubits[0]))
        org_circuit.append(cirq.measure_each(*qubits))
        wrapper.import_cirq_json(cirq.to_json(org_circuit))
        t_circuit = wrapper.export_qiskit()
        org_counts = simulate_cirq(org_circuit)
        t_counts = simulate_qiskit(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90,
                           str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(
                               t_counts))

    def test_controlled_cirq(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(3)
        org_circuit.h(0)
        org_circuit.h(1)
        org_circuit.append(qiskit.circuit.library.standard_gates.XGate().control(2), [2, 1, 0])
        org_circuit.measure_all()
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_cirq()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_cirq(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90,
                           str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(
                               t_counts))

    def test_unbound_params_cirq(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        theta = Parameter('theta')
        org_circuit.rz(theta, 0)
        wrapper.import_circuit(org_circuit)
        self.assertRaises(QasmError, wrapper.export_cirq)

    def test_bound_params_cirq(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        theta = Parameter('theta')
        org_circuit.rz(theta, 0)
        org_circuit.measure_all()
        org_circuit.assign_parameters({theta: np.pi/2}, inplace=True)
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_cirq()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_cirq(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90,
                           str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(
                               t_counts))

    def test_bound_params_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = Circuit()
        q = cirq.LineQubit(0)
        theta = sympy.Symbol('theta')
        org_circuit.append(cirq.Rx(rads=theta)(q))
        org_circuit.append(cirq.measure(q, key="c"))
        org_circuit = cirq.resolve_parameters(org_circuit, {'theta': np.pi/2})
        wrapper.import_cirq_circuit(org_circuit)
        t_circuit = wrapper.export_qiskit()
        org_counts = simulate_cirq(org_circuit)
        t_counts = simulate_qiskit(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90,
                           str(org_circuit) + " \n " + str(org_counts) + " \n " + str(t_circuit) + " \n " + str(t_counts))
