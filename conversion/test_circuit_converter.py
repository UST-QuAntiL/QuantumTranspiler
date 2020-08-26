from conversion.conversion_handler import ConversionHandler
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit
# from conversion.third_party_converter.pennylane_converter import PennylaneConverter
# from conversion.third_party_converter.quantastica_converter import QuantasticaConverter
from pyquil.gates import *
from conversion.converter.pyquil_converter import PyquilConverter
import numpy as np
from examples import *
from pyquil.latex import to_latex
import numpy as np


class TestCircuitConverter:
    def test_pytket(self):
        program = pyquil_custom()
        circuit = qiskit_custom()

        # tk = qiskit_to_tk(circuit)
        # pyquil = tk_to_pyquil(tk)
        # print(pyquil)
        # tk = pyquil_to_tk(program)
        # qiskit = tk_to_qiskit(tk)
        # show_figure(qiskit)

    def test_pennylane(self):
        qiskit = PennylaneConverter.pyquil_to_qasm(
            pyquil_custom())
        show_figure(qiskit)

        # qiskit = PennylaneConverter.qiskit_to_qiskit(ExampleCircuits.qiskit_custom())
        # print(qiskit)

    def test_quantastica(self):
        qasm = QuantasticaConverter.quil_to_qasm(
            pyquil_custom().out())
        print(qasm)
        show_figure(QuantumCircuit.from_qasm_str(qasm))

        # pyquil = QuantasticaConverter.qasm_to_pyquil(ExampleCircuits.qiskit_custom().qasm())
        # print(pyquil)

    def test_pyquil_own_import(self):
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        qiskit = handler.import_circuit(pyquil_custom())
        show_figure(qiskit[0])

    def test_pyquil_own_export(self):
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        program = handler.export_circuit(qc)[0]
        print(program)
        # latex = to_latex(program)
        # print(latex)
    
    def test_pyquil(self):
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        program = handler.export_circuit(qiskit_custom())[0]
        print(program)
        # program = handler.export_circuit(qiskit_custom())[0]
        # print(program)
        # qiskit = handler.import_circuit(pyquil_custom())
        # show_figure(qiskit[0])
        


if __name__ == "__main__":
    test= TestCircuitConverter()    
    test.test_pyquil_own_export()
