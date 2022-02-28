import unittest
from qiskit.circuit.random import random_circuit
from circuit.circuit_wrapper import CircuitWrapper
import traceback
import random


class MyTestCase(unittest.TestCase):
    def test_to_quil_random(self, n=50, max_depth=6, max_qbits=5):
        for i in range(n):
            qbits = random.randint(1, max_qbits)
            depth = random.randint(1, max_depth)
            circ_qk = random_circuit(qbits, depth)
            try:
                wrapper = CircuitWrapper(qiskit_circuit=circ_qk)
                circ_ql = wrapper.export_quil()

            except Exception as e:
                traceback.print_exc()
            finally:
                self.assertIsNotNone(circ_ql)
                # print(f"Iteration {i}:")
                # print(f"QASM:\n{circ_qk.qasm()}")
                # if circ_ql:
                #    print(f"Quil:\n{circ_ql}")


if __name__ == '__main__':
    unittest.main()
