from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk, tk_to_pyquil
from pytket.qiskit import qiskit_to_tk
from conversion.conversion_handler import ConversionHandler
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from conversion.third_party_converter.pytket_converter import PytketConverter
from circuit.qiskit_utility import show_figure
from conversion.third_party_converter.staq_converter import StaqConverter
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from conversion.third_party_converter.pennylane_converter import PennylaneConverter
from conversion.third_party_converter.quantastica_converter import QuantasticaConverter
from pyquil.gates import *
from conversion.converter.converter_interface import ConverterInterface
from conversion.converter.pyquil_converter import PyquilConverter
import numpy as np
from examples.example_circuits import ExampleCircuits
from pyquil.latex import display, to_latex

class TestCircuitConverter:
    def test_pytket(self):
        program = ExampleCircuits.pyquil_custom()
        circuit = ExampleCircuits.qiskit_custom()
        # qasm = PytketConverter.pyquil_to_qasm(ExampleCircuits.shor_pyquil)
        
        # does not support cu1 gates
        # pyquil = PytketConverter.qasm_to_pyquil(ExampleCircuits.shor_qasm)
        # print(pyquil)
        tk = qiskit_to_tk(circuit)
        pyquil = tk_to_pyquil(tk)
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

    def test_pennylane(self):
        # qiskit = PennylaneConverter.pyquil_to_qasm(ExampleCircuits.pyquil_custom())
        # print(qiskit)


        qiskit = PennylaneConverter.qiskit_to_qiskit(ExampleCircuits.qiskit_custom())
        print(qiskit)

    def test_quantastica(self):
        # qasm = QuantasticaConverter.quil_to_qasm(ExampleCircuits.shor_quil)
        pyquil = QuantasticaConverter.qasm_to_pyquil(ExampleCircuits.qiskit_custom().qasm())
        print(pyquil)

    def test_pyquil_own_import(self):
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        qiskit = handler.import_circuit(ExampleCircuits.pyquil_custom())
        show_figure(qiskit[0])

    def test_pyquil_own_export(self):
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        program = handler.export_circuit(ExampleCircuits.qiskit_custom())[0]
        print(program)
        latex = to_latex(program)
        print(latex)
        
if __name__ == "__main__":
    test = TestCircuitConverter()
    test.test_pyquil_own_export()
