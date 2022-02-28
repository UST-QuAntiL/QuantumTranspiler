import unittest
import json
import re
from qiskit.circuit.random import random_circuit
from circuit.circuit_wrapper import CircuitWrapper
import traceback
import random
from braket.circuits import Circuit
from pennylane import DeviceError

JSON_PATH = "results/gates_braket.json"


class TestBraket(unittest.TestCase):
    def test_to_braket_random(self, n=0, max_depth=4, max_qbits=4):
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
                circ_bk = wrapper.export_braket_ir()
                success_counter += 1
            except DeviceError as e:
                gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(e))[0]
                if gate in unsupported_gates["to"]:
                    unsupported_gates["to"][gate] += 1
                else:
                    unsupported_gates["to"][gate] = 1
            except Exception as ex:
                traceback.print_exc()


        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)
        if n > 0:
            print(f"Successfully translated {success_counter}/{i + 1} circuits!")
            self.assertTrue((success_counter / (i + 1)) >= 0.5)


    def test_to_and_from_braket_random(self, n=20, max_depth=3, max_qbits=3):
        to_success_counter = 0
        from_success_counter = 0
        with open(JSON_PATH, "r") as unsupported_gates_json:
            gates_data = unsupported_gates_json.read()
        unsupported_gates = json.loads(gates_data)

        for i in range(n):
            qbits = random.randint(1, max_qbits)
            depth = random.randint(1, max_depth)
            circ_qk = random_circuit(qbits, depth)
            try:
                wrapper = CircuitWrapper(qiskit_circuit=circ_qk)
                circ_bk = wrapper.export_braket_ir()
                to_success_counter += 1
                back_wrapper = CircuitWrapper(braket_str=circ_bk)
                circ_qk_back = back_wrapper.export_qiskit()
                from_success_counter += 1
            except DeviceError as e:
                gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(e))[0]
                if gate in unsupported_gates["to"]:
                    unsupported_gates["to"][gate] += 1
                else:
                    unsupported_gates["to"][gate] = 1
            except NotImplementedError as e2:
                gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(e2))[0]
                if gate in unsupported_gates["from"]:
                    unsupported_gates["from"][gate] += 1
                else:
                    unsupported_gates["from"][gate] = 1
            except Exception as ex:
                traceback.print_exc()

        if "total" in unsupported_gates["from"]:
            unsupported_gates["from"]["total"] += to_success_counter
        else:
            unsupported_gates["from"]["total"] = to_success_counter

        dict_str = json.dumps(unsupported_gates, indent=4)

        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)
        if n > 0:
            print(f"Successfully translated {to_success_counter}/{i + 1} circuits!")
            print(f"Successfully translated back {from_success_counter}/{to_success_counter} circuits!")
            self.assertTrue((to_success_counter / (i + 1)) >= 0.5)
            self.assertTrue((from_success_counter / to_success_counter) >= 0.25)

    """    def test_to_braket_tk_random(self, n=5, max_depth=4, max_qbits=4):
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
                circ_bk = wrapper.export_braket_ir()
                success_counter += 1
            except NotImplementedError as e:
                gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(e))[0]
                if gate in unsupported_gates["to"]:
                    unsupported_gates["to"][gate] += 1
                else:
                    unsupported_gates["to"][gate] = 1
            except Exception as ex:
                self.fail(ex)

        print(f"Successfully translated {success_counter}/{i + 1} circuits!")
        dict_str = json.dumps(unsupported_gates, indent=4)
        with open(JSON_PATH, "w") as unsupported_gates_json:
            unsupported_gates_json.write(dict_str)
        self.assertTrue((success_counter / (i + 1)) >= 0.5)"""


if __name__ == '__main__':
    unittest.main()
