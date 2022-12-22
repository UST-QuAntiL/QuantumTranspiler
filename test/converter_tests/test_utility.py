import random
import time

import qsharp
import cirq
from braket.circuits import Circuit
from braket.devices import LocalSimulator
from pyquil import Program, get_qc
from pyquil.api import local_forest_runtime
from qiskit import QuantumCircuit, transpile, Aer
from qiskit_aer import AerSimulator
from qiskit.circuit.random import random_circuit
from qsharp import QSharpCallable
from cirq import Circuit as CirqCircuit


def simulate_qiskit(circuit: QuantumCircuit, shots=2000):
    simulator = AerSimulator()
    compiled = transpile(circuit, simulator)
    result = simulator.run(compiled, shots=shots).result()
    counts = {
        key.replace(" ", "")[::-1]: value
        for key, value in result.get_counts(compiled).items()
    }
    return counts


def simulate_braket(circuit: Circuit, shots=2000):
    simulator = LocalSimulator()
    result = simulator.run(circuit, shots=shots).result()
    return result.measurement_counts


# https://stackoverflow.com/questions/2470971/fast-way-to-test-if-a-port-is-in-use-using-python
def is_port_in_use(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

# PyQuil Simulation has issues with contexts and ports being in use. This makes using it in a container impossible.
# Checking for ports and waiting before execution tries to mitigate it, but it does not currently work
def simulate_pyquil(program: Program, shots=2000):
    program.wrap_in_numshots_loop(shots)
    while is_port_in_use(5000) or is_port_in_use(5555):
        print("Port in use")
        time.sleep(0.5)
    with local_forest_runtime(host="localhost"):
        time.sleep(1)
        print("In Context")
        qc = get_qc("8q-qvm")
        print("Created QVM")
        results = qc.run(qc.compile(program)).readout_data.get("ro")
    counts = {}
    for result in results:
        key = "".join(map(str, result))
        counts[key] = counts.setdefault(key, 0) + 1
    return counts


def simulate_qsharp(code: str, shots=2000):
    circuit: QSharpCallable = qsharp.compile(code)
    counts = {}
    for i in range(shots):
        result = circuit.simulate()
        key = "".join(map(str, result))
        counts[key] = counts.setdefault(key, 0) + 1
    return counts


def simulate_cirq(circuit: CirqCircuit, shots=2000, reorder=False):
    simulator = cirq.Simulator()
    result = simulator.run(circuit, repetitions=shots)

    def fold(l):
        return "".join(str(e[0]) for e in l)

    stats = result.measurements
    # Cirq measurements by the time they occurred, in translating and execution. Thus, they need to be ordered
    # differently based on if they are compared with pre-translation or post-translation qiskit measurements
    counts = result.multi_measurement_histogram(
        keys=sorted(stats.keys()) if reorder else stats.keys(), fold_func=fold
    )
    return counts


def intersection(counts_1, counts_2):
    int_sum = 0
    org_sum = 0
    for key_1 in counts_1.keys():
        result_1 = counts_1[key_1]
        result_2 = counts_2[key_1] if key_1 in counts_2.keys() else 0
        int_sum += min(result_1, result_2)
        org_sum += result_1
    return int_sum / org_sum


def generate_circuit():
    width = random.randint(3, 6)
    depth = random.randint(3, 6)
    circuit = random_circuit(width, depth, measure=True)
    return circuit


def generate_circuit_cirq():
    has_m = False
    circuit = cirq.Circuit()
    while not has_m:
        width = random.randint(3, 6)
        depth = random.randint(3, 6)

        def mapping_func(qid: cirq.Qid) -> str:
            return f"c_{str(qid)}"

        circuit = cirq.testing.random_circuit(width, depth, 0.5)
        circuit.append(
            cirq.measure_each(*(circuit.all_qubits()), key_func=mapping_func)
        )
        has_m = circuit.has_measurements()
    return circuit
