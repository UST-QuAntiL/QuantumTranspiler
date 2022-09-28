import random
from braket.circuits import Circuit
from braket.devices import LocalSimulator
from pyquil import Program, get_qc
from pyquil.api import local_forest_runtime
from qiskit import QuantumCircuit, transpile
from qiskit.circuit.random import random_circuit
from qiskit.providers.aer import QasmSimulator


def simulate_qiskit(circuit: QuantumCircuit, shots=2000):
    simulator = QasmSimulator()
    compiled = transpile(circuit, simulator)
    result = simulator.run(compiled, shots=shots).result()
    counts = {key.replace(" ", "")[::-1]: value for key, value in result.get_counts(compiled).items()}
    return counts


def simulate_braket(circuit: Circuit, shots=2000):
    simulator = LocalSimulator()
    result = simulator.run(circuit, shots=shots).result()
    return result.measurement_counts

def simulate_pyquil(program: Program, shots=2000):
    program.wrap_in_numshots_loop(shots)
    with local_forest_runtime():
        qc = get_qc('8q-qvm')
        results = qc.run(qc.compile(program)).readout_data.get("ro")
        counts = {}
        for result in results:
            key = "".join(map(str, result))
            counts[key] = counts.setdefault(key, 0) + 1
        return counts



def intersection(counts_1, counts_2):
    int_sum = 0
    org_sum = 0
    for key_1 in counts_1.keys():
        result_1 = counts_1[key_1]
        result_2 = counts_2[key_1] if key_1 in counts_2.keys() else 0
        int_sum += min(result_1, result_2)
        org_sum += result_1
    return int_sum/org_sum


def generate_circuit():
    width = random.randint(3, 6)
    depth = random.randint(3, 6)
    circuit = random_circuit(width, depth, measure=True)
    return circuit
