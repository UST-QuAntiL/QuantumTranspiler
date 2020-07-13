from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import plot_histogram, plot_state_city
from qiskit.providers.aer import QasmSimulator
from qiskit import Aer, execute
from examples import shor_15, qiskit_custom
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
        program.wrap_in_numshots_loop(shots)
        with local_forest_runtime():
            qvm = get_qc('9q-square-qvm')
            executable = qvm.compile(program)
            bitstrings = qvm.run(executable)
            counts = self._bitstrings_to_counts(bitstrings)
            plot_histogram(counts, title=title)
            # print(executable.program)
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
        print(wrapper.export_qasm())
        transpiled_circuit_pyquil = wrapper.export_pyquil()
        print(wrapper.export_pyquil())
        return transpiled_circuit_pyquil

    def convert_to_pyquil(self, circuit: QuantumCircuit) -> Program:
        wrapper = CircuitWrapper(qiskit_circuit=circuit)
        circuit_pyquil = wrapper.export_pyquil()
        return circuit_pyquil

    def simulate(self, circuit: QuantumCircuit, plot=False):
        counts_qiskit = self.call_simulate_qiskit(circuit)
        print("Counts Qiskit: " + str(counts_qiskit))
        counts_rigetti = self.call_simulate_rigetti(circuit)   
        print("Counts Rigetti: " + str(counts_rigetti))

        if plot:            
            plt.show()

    def call_simulate_qiskit(self, circuit: QuantumCircuit):
        counts_qiskit_raw = self.simulate_qiskit(
            circuit, "Qiskit - Not transpiled")
        transpiled_circuit_qiskit = self.transpile_qiskit(circuit)
        counts_qiskit_transpiled = self.simulate_qiskit(
            transpiled_circuit_qiskit, "Qiskit - Transpiled")
        return [counts_qiskit_raw, counts_qiskit_transpiled]

    def call_simulate_rigetti(self, circuit: QuantumCircuit):
        program = self.convert_to_pyquil(circuit)
        counts_rigetti_raw = self.simulate_pyquil(
            program, "Rigetti - Not transpiled")
        transpiled_circuit_pyquil = self.transpile_pyquil(circuit)
        counts_rigetti_transpiled = self.simulate_pyquil(
            transpiled_circuit_pyquil, "Rigetti - Transpiled")
        return [counts_rigetti_raw, counts_rigetti_transpiled]

    def test_data(self, decomposition = True):
        from qiskit import QuantumRegister, ClassicalRegister
        from qiskit import QuantumCircuit, execute, Aer
        import numpy as np
        qc = QuantumCircuit()
        q = QuantumRegister(5, 'q')
        ro = ClassicalRegister(5, 'ro')
        qc.add_register(q)
        qc.add_register(ro)
        qc.u1(np.pi / 2, q[2])
        qc.cx(q[3], q[2])

        # two decompositions of U3(-np.pi / 2, 0, 0, q[2]) leading to different results
        if decomposition:
            # qc.rz(-np.pi / 2, q[2])
            # qc.rx(np.pi / 2, q[2])
            # qc.rz(3 * np.pi / 2, q[2])
            # qc.rx(np.pi / 2, q[2])
            # qc.rz(-np.pi / 2, q[2])

            qc.rz(3*np.pi, q[2])
            qc.rx(np.pi / 2, q[2])
            qc.rz(3 * np.pi / 2, q[2])
            qc.rx(np.pi / 2, q[2])
            qc.rz(0, q[2])
        else:
            qc.ry(-np.pi / 2, q[2])

        qc.cx(q[3], q[2])
        qc.rz(-np.pi, q[2])
        qc.rx(np.pi / 2, q[2])
        qc.rz(np.pi / 2, q[2])
        qc.rx(np.pi / 2, q[2])
        qc.rz(-np.pi / 2, q[2])

        qc.measure(q[0], ro[0])
        qc.measure(q[1], ro[1])
        qc.measure(q[2], ro[2])
        qc.measure(q[3], ro[3])
        qc.measure(q[4], ro[4])

        backend = Aer.get_backend('qasm_simulator')
        job = execute(qc, backend=backend)
        job_result = job.result()
        print(job_result.get_counts(qc))


if __name__ == "__main__":
    # TODO Controlled RXGate differences between rigetti transpiled and everything else    
    circuit = shor_15()
    circuit = qiskit_custom()
    test = TestTranspilation()
    # test.test_data(decomposition = True)
    test.simulate(circuit)
