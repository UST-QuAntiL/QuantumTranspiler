from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import plot_histogram, plot_state_city
from qiskit.providers.aer import QasmSimulator
from qiskit import Aer, execute
from examples import shor_15
from circuit import CircuitWrapper
import matplotlib.pyplot as plt

class TestTranspilation():
    def simulate_qiskit(self, circuit: QuantumCircuit):
        simulator = QasmSimulator()
        result = execute(circuit, simulator).result()
        counts = result.get_counts(circuit)
        figure = plot_histogram(counts, title='Qiskit counts')
        plt.show()

    def transpile_qiskit(self, circuit: QuantumCircuit):
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        transpiled_circuit = wrapper.unroll_ibm()
        return transpiled_circuit

    def transpile_pyquil(self, circuit: QuantumCircuit):
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        transpiled_circuit = wrapper.unroll_rigetti()
        return transpiled_circuit

    

    
    def simulate(self):
        circuit = shor_15()
        transpiled_circuit_qiskit = self.transpile_qiskit(self, circuit)
        transpiled_circuit_pyquil = self.transpile_pyquil(self, circuit)
        self.simulate_qiskit(circuit)
        self.simulate_qiskit(transpiled_circuit_qiskit)

if __name__ == "__main__":
    test = TestTranspilation()
    test.simulate()