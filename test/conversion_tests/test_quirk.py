import unittest
import json
import re
from qiskit.circuit.random import random_circuit as random_circuit_qk
from circuit.circuit_wrapper import CircuitWrapper
import traceback
import random
from cirq.contrib.qasm_import.exception import QasmException
from cirq.testing import random_circuit as random_circuit_cq
import cirq

JSON_PATH = "results/gates_quirk.json"


class TestCirq(unittest.TestCase):
    def test_to_quirk_random(self, n=50, max_depth=4, max_qbits=4):
        success_counter = 0
        with open(JSON_PATH, "r") as unsupported_gates_json:
            gates_data = unsupported_gates_json.read()
        unsupported_gates = json.loads(gates_data)

        if "total" in unsupported_gates["to"]:
            unsupported_gates["to"]["total"] += n
        else:
            unsupported_gates["to"]["total"] = n

        for i in range(n):

            qbits = random.randint(1, max_qbits)
            depth = random.randint(1, max_depth)
            circ_qk = random_circuit_qk(qbits, depth)

            try:
                wrapper = CircuitWrapper(qiskit_circuit=circ_qk)
                circ_qrk = wrapper.export_quirk()
                success_counter += 1
            except QasmException as e:
                gate = re.findall(r'"(.*?)"', e.message)[0]
                if gate in unsupported_gates["to"]:
                    unsupported_gates["to"][gate] += 1
                else:
                    unsupported_gates["to"][gate] = 1
            except Exception as ex:
                traceback.print_exc()


        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)
        if n>0:
            print(f"Successfully translated {success_counter}/{i + 1} circuits!")
            self.assertTrue(success_counter / i + 1 > 0.5)

    # Circuits are randomly generated in cirq then translated to quirk and then finally translated to qiskit, again over cirq
    def test_from_quirk_random(self, n=50, max_moments=6, max_qbits=5, density=0.9):
        success_counter = 0
        with open(JSON_PATH, "r") as unsupported_gates_json:
            gates_data = unsupported_gates_json.read()
        unsupported_gates = json.loads(gates_data)

        if "total" in unsupported_gates["from"]:
            unsupported_gates["from"]["total"] += n
        else:
            unsupported_gates["from"]["total"] = n

        for i in range(n):

            qbits = random.randint(1, max_qbits)
            moments = random.randint(1, max_moments)
            circ_cq = random_circuit_cq(qbits, moments, density)
            try:
                qrk_url = cirq.contrib.quirk.circuit_to_quirk_url(circ_cq)
                wrapper = CircuitWrapper(quirk_url=qrk_url)
                circ_qk = wrapper.export_qiskit()
                success_counter += 1
            except TypeError as e:
                gate = re.findall(r'(?:cirq.)(.*?)(?: |\()', str(e))[0]
                if gate in unsupported_gates["from"]:
                    unsupported_gates["from"][gate] += 1
                else:
                    unsupported_gates["from"][gate] = 1
            except Exception as ex:
                traceback.print_exc()


        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)

        if n>0:
            print(f"Successfully translated {success_counter}/{i + 1} circuits!")
            self.assertTrue(success_counter / i + 1 > 0.5)


if __name__ == '__main__':
    unittest.main()
