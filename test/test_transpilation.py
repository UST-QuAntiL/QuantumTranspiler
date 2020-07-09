from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import plot_histogram, plot_state_city
from qiskit.providers.aer import QasmSimulator
from qiskit import Aer, execute
from examples import shor_15, qiskit_custom
from circuit import CircuitWrapper
import matplotlib.pyplot as plt
from pyquil import Program, get_qc
from pyquil.api import local_forest_runtime

class TestTranspilation():
    def simulate_qiskit(self, circuit: QuantumCircuit, title: str):
        simulator = QasmSimulator()
        result = execute(circuit, simulator).result()
        counts = result.get_counts(circuit)
        plot_histogram(counts, title=title)
        return counts

    def simulate_pyquil(self, program: Program, title: str):
        """ qvm -S and quilc -S must be executed to run the pyquil compiler and simulator servers
        http://docs.rigetti.com/en/stable/start.html
        """
        with local_forest_runtime():
            qvm = get_qc('9q-square-qvm')
            results = qvm.run_and_measure(program, trials=100)
            print(results)


    def transpile_qiskit(self, circuit: QuantumCircuit) -> QuantumCircuit:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        transpiled_circuit = wrapper.unroll_ibm()
        return transpiled_circuit

    def transpile_pyquil(self, circuit: QuantumCircuit) -> Program:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        wrapper.unroll_rigetti()
        transpiled_circuit_pyquil = wrapper.export_pyquil()
        print(transpiled_circuit_pyquil)
        return transpiled_circuit_pyquil

    def convert_to_pyquil(self, circuit: QuantumCircuit) -> Program:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        circuit_pyquil = wrapper.export_pyquil()
        return circuit_pyquil
    
    def simulate(self, circuit: QuantumCircuit):        
        # program = self.convert_to_pyquil(circuit)
        # transpiled_circuit_qiskit = self.transpile_qiskit(circuit)
        transpiled_circuit_pyquil = self.transpile_pyquil(circuit)       
        counts_qiskit_raw = self.simulate_qiskit(circuit, "Qiskit - Not transpiled")
        # counts_qiskit_transpiled= self.simulate_qiskit(transpiled_circuit_qiskit, "Qiskit - Transpiled")
        # counts_rigetti_raw = self.simulate_pyquil(program, "Rigetti - Not transpiled")        
        counts_rigetti_transpiled = self.simulate_pyquil(transpiled_circuit_pyquil, "Rigetti - Transpiled")
        plt.show()




if __name__ == "__main__":
    circuit = shor_15()
    circuit = qiskit_custom()
    test = TestTranspilation()
    test.simulate(circuit)