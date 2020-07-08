from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import plot_histogram, plot_state_city
from qiskit.providers.aer import QasmSimulator
from qiskit import Aer, execute
from examples import shor_15
import matplotlib.pyplot as plt

class TestTranspilation():
    def simulate_qiskit(self, circuit: QuantumCircuit):
        simulator = QasmSimulator()
        result = execute(circuit, simulator, shots=2, memory=True).result()
        counts = result.get_counts(circuit)
        memory = result.get_memory(circuit)
        figure = plot_histogram(counts, title='Bell-State counts')
        print(memory)
        figure.show()

    
    def simulate(self):
        circuit = shor_15()
        self.simulate_qiskit(circuit)

if __name__ == "__main__":
    test = TestTranspilation()
    test.simulate()