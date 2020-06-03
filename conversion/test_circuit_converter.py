from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from conversion.pytket_converter import PytketConverter
from circuit.qiskit_utility import show_figure
from conversion.staq_converter import StaqConverter
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
# from conversion.pennylane_converter import PennylaneConverter
from conversion.quantastica_converter import QuantasticaConverter
from pyquil.gates import *
from conversion.pyquil_converter import PyquilConverter
import numpy as np
from examples.example_circuits import ExampleCircuits
from pyquil.latex import display, to_latex
class TestCircuitConverter:
    def test_pytket(self):
        program = ExampleCircuits.pyquil_custom()
        print(program)
        # qasm = PytketConverter.pyquil_to_qasm(ExampleCircuits.shor_pyquil)
        tk = pyquil_to_tk(program)
        # does not support cu1 gates
        # pyquil = PytketConverter.qasm_to_pyquil(ExampleCircuits.shor_qasm)
        # print(pyquil)

        # # quirk import
        # circuit = PytketConverter.quirk_to_cirq("https://algassert.com/quirk#circuit=%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%22%E2%80%A2%22%2C%22%E2%80%A2%22%2C%22X%22%5D%5D%7D")
        # print(circuit)

    def test_staq(self):
        staq = StaqConverter(
            "/home/seedrix/tools/staq/build/staq", ExampleCircuits.shor_qasm)
        # quil = staq.qasm_to_quil()
        # does not work, because of undefined Dagger instruction
        # program = Program(quil)
        # projectq = staq.qasm_to_projectq()
        # qsharp = staq.qasm_to_qsharp()
        # cirq = staq.qasm_to_cirq()
        # staq.inline()
        # staq.o2()
        staq.default_optimization()

    # def test_pennylane(self):
        # qiskit = PennylaneConverter.pyquil_to_qasm(ExampleCircuits.pyquil_custom())
        # print(qiskit)

        # print(PennylaneConverter.qasm_to_qasm(ExampleCircuits.qiskit_shor()))

    def test_quantastica(self):
        # qasm = QuantasticaConverter.quil_to_qasm(ExampleCircuits.shor_quil)
        # print(qasm)
        # circuit = QuantumCircuit.from_qasm_str(qasm)
        # show_figure(circuit)
        qasm = QuantasticaConverter.pyquil_to_qasm(ExampleCircuits.pyquil_shor())
        print(qasm)

    def test_pyquil_own_import(self):
        qiskit = PyquilConverter.import_pyquil(ExampleCircuits.pyquil_custom())
        show_figure(qiskit)

    def test_pyquil_own_export(self):
        program = PyquilConverter.export_pyquil(ExampleCircuits.qiskit_custom())
        print(program)
        latex = to_latex(program)
        print(latex)
if __name__ == "__main__":
    test = TestCircuitConverter()
    test.test_pyquil_own_export()
