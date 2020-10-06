import ast

from qiskit.circuit.library.standard_gates.u1 import MCU1Gate
from conversion.converter.command_converter import qiskit_commands_to_circuit
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
import numpy as np
from circuit.circuit_wrapper import CircuitWrapper
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from examples import *
import qiskit.circuit.library.standard_gates as Gates
from qiskit.circuit import Parameter

class TestCircuitWrapper:
    def test_pyquil_import(self):
        wrapper = CircuitWrapper(pyquil_program=pyquil_custom())
        show_figure(wrapper.circuit)

    def test_pyquil_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom())
        pyquil = wrapper.export_pyquil()
        print(pyquil)

    def test_qasm_export(self):
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom_unroll())
        qasm = wrapper.export_qasm()
        print(qasm)

    def test_decompose(self):
        print(qiskit_custom_unroll())
        wrapper = CircuitWrapper(qiskit_circuit=qiskit_custom_unroll())
        wrapper.decompose_to_standard_gates()
        print(wrapper.circuit)

    def test_qiskit_commands(self):
        wrapper = CircuitWrapper(qiskit_circuit=shor_general(3))
        # print(wrapper.circuit)
        commands = wrapper.export_qiskit_commands()        
        print(commands)
        circuit = qiskit_commands_to_circuit(commands)
        print(circuit)

    def test_pyquil_commands(self):
        wrapper = CircuitWrapper(qiskit_circuit=grover_general_logicalexpression_qiskit("(A | B) & (A | ~B) & (~A | B)"))
        print(wrapper.circuit)        
        commands = wrapper.export_pyquil_commands()        
        print(commands)
        # circuit = commands_to_circuit(commands)
        # print(circuit)
        
    def test_unroll(self):
        wrapper = CircuitWrapper(qiskit_circuit=shor_general(3))
        wrapper.unroll_rigetti()
        print(wrapper.circuit)
        # wrapper.unroll(["u3", "u2", "cz", "u1"])
        # wrapper.unroll(["rz", "rx", "cz"])
        # wrapper.unroll(["rx", "cz"])

    def test_analysis(self):       
        wrapper = CircuitWrapper(qiskit_circuit=shor_15())
        print(wrapper.circuit)
        wrapper.unroll_ibm()
        print(wrapper.circuit)

        # print(wrapper.circuit)
        # print(wrapper.depth())
        # print(wrapper.depth_gate_times())
        print(wrapper.depth_two_qubit_gates())

    def test_topology_mapping(self):
        wrapper = CircuitWrapper(qiskit_circuit=shor_15())
        wrapper.unroll_ibm()
        print(wrapper.circuit)
        wrapper.topology_mapping(ibmq_london())
        print(wrapper.circuit)
        
    def test_compare_depth_topology(self):
        wrapper = CircuitWrapper(qiskit_circuit=shor_15())
        wrapper.compare_depth_topology(ibmq_16_melbourne(), wrapper.depth_two_qubit_gates)

if __name__ == "__main__":
    test = TestCircuitWrapper()
    test.test_compare_depth_topology()