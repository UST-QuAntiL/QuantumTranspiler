from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import plot_histogram, plot_state_city
from qiskit.providers.aer import QasmSimulator
from qiskit import Aer, execute
from examples import *
from circuit import CircuitWrapper
import matplotlib.pyplot as plt
from pyquil import Program, get_qc
from pyquil.api import local_forest_runtime
from typing import List


class TestTranspilation():
    def simulate_qiskit(self, circuit: QuantumCircuit, title: str, shots=1000):
        simulator = QasmSimulator()
        result = execute(circuit, simulator, shots=shots).result()
        counts = result.get_counts(circuit)
        plot_histogram(counts, title=title)
        return counts

    def simulate_pyquil(self, program: Program, title: str, shots=1000):
        """ qvm -S and quilc -S must be executed to run the pyquil compiler and simulator servers
        http://docs.rigetti.com/en/stable/start.html
        """
        qubits = program.get_qubits()
        qubit_size = len(qubits)
        program.wrap_in_numshots_loop(shots)
        with local_forest_runtime():
            # create a simulator for the given qubit size that is fully sonnected
            qvm = get_qc(str(qubit_size) + 'q-qvm')
            executable = qvm.compile(program)
            # print(executable.program)
            bitstrings = qvm.run(executable)
            counts = self._bitstrings_to_counts(bitstrings)
            plot_histogram(counts, title=title)
            return counts

    def _bitstrings_to_counts(self, bitstrings: List[List[int]]):
        counts = {}
        for bitstring in bitstrings:
            bits = ""
            for bit in bitstring:
                # r[0] is the first qubit in the list --> revert the array to have the same behaviour as qiskit
                bits = str(bit) + bits
            counts[bits] = counts.get(bits, 0) + 1
        return counts

    def transpile_qiskit(self, circuit: QuantumCircuit) -> QuantumCircuit:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        transpiled_circuit = wrapper.unroll_ibm()
        return transpiled_circuit

    def transpile_pyquil(self, circuit: QuantumCircuit) -> Program:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        wrapper.unroll_rigetti()
        transpiled_circuit_pyquil = wrapper.export_pyquil()
        return transpiled_circuit_pyquil

    def convert_to_pyquil(self, circuit: QuantumCircuit) -> Program:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        circuit_pyquil = wrapper.export_pyquil()
        return circuit_pyquil

    def simulate(self, circuit: QuantumCircuit, plot=False):
        counts_qiskit = self.call_simulate_qiskit(circuit)        
        counts_rigetti = self.call_simulate_rigetti(circuit) 
        # print("Counts Qiskit: " + str(counts_qiskit))  
        # print("Counts Rigetti: " + str(counts_rigetti))

        if plot:            
            plt.show()

    def call_simulate_qiskit(self, circuit: QuantumCircuit):
        counts_qiskit_raw = self.simulate_qiskit(
            circuit, "Qiskit - Not transpiled")
        print("Counts Qiskit (raw): " + str(counts_qiskit_raw))          
        transpiled_circuit_qiskit = self.transpile_qiskit(circuit)
        print("he")
        counts_qiskit_transpiled = self.simulate_qiskit(
            transpiled_circuit_qiskit, "Qiskit - Transpiled")
        print("Counts Qiskit (transpiled): " + str(counts_qiskit_transpiled))  
        return [counts_qiskit_raw, counts_qiskit_transpiled]

    def call_simulate_rigetti(self, circuit: QuantumCircuit):
        program = self.convert_to_pyquil(circuit)
        # print(program)
        counts_rigetti_raw = self.simulate_pyquil(
            program, "Rigetti - Not transpiled")
        print("Counts Rigetti (raw): " + str(counts_rigetti_raw))
        transpiled_circuit_pyquil = self.transpile_pyquil(circuit)
        counts_rigetti_transpiled = self.simulate_pyquil(
            transpiled_circuit_pyquil, "Rigetti - Transpiled")
        print("Counts Rigetti (transpiled): " + str(counts_rigetti_transpiled))
        return [counts_rigetti_raw, counts_rigetti_transpiled]        


if __name__ == "__main__":
    # working:
    # circuit = shor_15()
    # circuit = qiskit_custom()
    # circuit = grover_fix_qiskit()
    # circuit = grover_fix_SAT_qiskit()
    # circuit = bernstein_vazirani_general_qiskit_integer(12, 20) 
    # circuit = bernstein_vazirani_general_qiskit_binary_string(9, "010000110") 

    # errors:
    # error in quil compiler: native quil code
    # circuit = shor_general(3)

    # for both grover general implementations: rigetti raw different results --> probably because of mcvxchain https://github.com/Qiskit/qiskit-terra/issues/4524
    # circuit = grover_general_truthtable_qiskit("10100000")    
    circuit = grover_general_logicalexpression_qiskit("(A | B) & (A | ~B) & (~A | B)")
    # wrapper = CircuitWrapper(qiskit_circuit=circuit)
    # qasm = wrapper.export_qasm()
    # print(qasm)
    
    print(circuit)
    test = TestTranspilation()
    test.simulate(circuit)
