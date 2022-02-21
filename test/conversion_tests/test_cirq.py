import unittest
import json
import re
from qiskit.circuit.random import random_circuit
from circuit.circuit_wrapper import CircuitWrapper
import traceback
import random
from cirq.contrib.qasm_import.exception import QasmException
from cirq.testing import random_circuit
import cirq

JSON_PATH = "results/gates_cirq.json"


class TestCirq(unittest.TestCase):
    def test_to_cirq_random(self, n=0, max_depth=4, max_qbits=4):
        success_counter = 0
        with open(JSON_PATH, "r") as unsupported_gates_json:
            gates_data = unsupported_gates_json.read()
        unsupported_gates = json.loads(gates_data)

        for i in range(n):
            qbits = random.randint(1, max_qbits)
            depth = random.randint(1, max_depth)
            circ_qk = random_circuit(qbits, depth)

            try:
                wrapper = CircuitWrapper(qiskit_circuit=circ_qk)
                circ_cq = wrapper.export_cirq_json()
                success_counter += 1
            except QasmException as e:
                gate = re.findall(r'"(.*?)"', e.message)[0]
                if gate in unsupported_gates["to"]:
                    unsupported_gates["to"][gate] += 1
                else:
                    unsupported_gates["to"][gate] = 1
            except Exception as ex:
                self.fail(ex)


        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)
        if n>0:
            print(f"Successfully translated {success_counter}/{i + 1} circuits!")
            self.assertTrue(success_counter / i + 1 > 0.5)

    def test_from_cirq_random(self, n=5, max_moments=6, max_qbits=5, density=0.9):
        success_counter = 0
        with open(JSON_PATH, "r") as unsupported_gates_json:
            gates_data = unsupported_gates_json.read()
        unsupported_gates = json.loads(gates_data)

        for i in range(n):
            qbits = random.randint(1, max_qbits)
            moments = random.randint(1, max_moments)
            circ_cq = random_circuit(qbits, moments, density)
            json_cq = cirq.to_json(circ_cq)

            try:
                wrapper = CircuitWrapper(cirq_str=json_cq)
                circ_qk = wrapper.export_qiskit()
                success_counter += 1
            except Exception as ex:
                self.fail(ex)


        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)

        if n>0:
            print(f"Successfully translated {success_counter}/{i + 1} circuits!")
            self.assertTrue(success_counter / i + 1 > 0.5)


if __name__ == '__main__':
    unittest.main()
