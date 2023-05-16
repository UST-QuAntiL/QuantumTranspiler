import unittest

import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from circuit import CircuitWrapper
from test.converter_tests.test_utility import (
    generate_circuit,
    simulate_qiskit,
    intersection,
    simulate_qsharp,
)


# Naming of tests is test_"tested property"_"target language"


class QSharpTest(unittest.TestCase):
    def test_rand_qsharp(self):
        wrapper = CircuitWrapper()
        for i in range(10):
            with self.subTest(f"Testing circuit {i}."):
                org_circuit = generate_circuit()
                org_counts = simulate_qiskit(org_circuit)
                wrapper.import_circuit(org_circuit)
                t_circuit = wrapper.export_qsharp()
                t_counts = simulate_qsharp(t_circuit)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(
                    similarity,
                    0.90,
                    str(org_circuit.qasm())
                    + " \n "
                    + str(org_counts)
                    + " \n "
                    + str(t_circuit)
                    + " \n "
                    + str(t_counts),
                )

    def test_rand_qiskit(self):
        wrapper = CircuitWrapper()
        for i in range(10):
            with self.subTest(f"Testing circuit {i}."):
                temp_circuit = generate_circuit()
                wrapper.import_circuit(temp_circuit)
                org_circuit = wrapper.export_qsharp()
                org_counts = simulate_qsharp(org_circuit)
                wrapper.import_qsharp(org_circuit)
                t_circuit = wrapper.export_qiskit()
                t_counts = simulate_qiskit(t_circuit)
                similarity = intersection(org_counts, t_counts)
                self.assertGreater(similarity, 0.90)

    def test_no_direct_translation_qsharp(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(2)
        org_circuit.u(np.pi, np.pi, np.pi / 2, 1)
        org_circuit.cu(np.pi, np.pi, np.pi / 2, 0, 0, 1)
        org_circuit.crx(np.pi / 2, 1, 0)
        org_circuit.iswap(0, 1)
        org_circuit.cp(np.pi / 2, 0, 1)
        org_circuit.measure_all()
        wrapper.import_circuit(org_circuit)
        t_circuit = wrapper.export_qsharp()
        org_counts = simulate_qiskit(org_circuit)
        t_counts = simulate_qsharp(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90)

    def test_no_direct_translation_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = """
            open Microsoft.Quantum.Canon;
            open Microsoft.Quantum.Intrinsic;
            open Microsoft.Quantum.Measurement;
            
            operation Circuit(): Result[] {
                mutable r = [Zero, Zero, Zero];
                use q0 = Qubit[2] {
                    H(q0[0]);
                    CX(q0[0], q0[1]);
                    R1(1.5707963267948966, q0[1]);
                    Controlled Rx([q0[0]], (5.16920185242945, q0[1]));
                    set r w/= 0 <- M(q0[0]);
                    set r w/= 1 <- M(q0[1]);
                    Reset(q0[1]);
                    set r w/= 2 <- M(q0[1]);
                    return r;
                }
            }
        """
        wrapper.import_qsharp(org_circuit)
        t_circuit = wrapper.export_qiskit()
        org_counts = simulate_qsharp(org_circuit)
        t_counts = simulate_qiskit(t_circuit)
        similarity = intersection(org_counts, t_counts)
        self.assertGreater(similarity, 0.90)

    def test_non_quantum_operations_qiskit(self):
        wrapper = CircuitWrapper()
        org_circuit = """
                   open Microsoft.Quantum.Canon;
                   open Microsoft.Quantum.Intrinsic;
                   open Microsoft.Quantum.Measurement;
                   open Microsoft.Quantum.Random;
                   
                   operation Circuit(): Int[] {
                       mutable r = [0, 0, 0];
                       set r w/= 0 <- DrawRandomInt(0, 1);
                       set r w/= 1 <- DrawRandomInt(0, 1);
                       set r w/= 2 <- DrawRandomInt(0, 1);
                       return r;
                   }
               """
        self.assertRaises(NotImplementedError, wrapper.import_qsharp, org_circuit)

    def test_params_qsharp(self):
        wrapper = CircuitWrapper()
        org_circuit = QuantumCircuit(1)
        theta = Parameter("theta")
        org_circuit.rz(theta, 0)
        wrapper.import_circuit(org_circuit)
        self.assertRaises(RuntimeError, wrapper.export_qsharp)
