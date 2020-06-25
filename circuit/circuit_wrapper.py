from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from conversion.conversion_handler import ConversionHandler
from conversion.converter.pyquil_converter import PyquilConverter
from pyquil import Program
from qiskit.converters import circuit_to_dag, dag_to_circuit
from circuit.qiskit_utility import show_figure
from transpilation.decompose import Decompose

class CircuitWrapper:
    def __init__(self, pyquil_program: Program = None, quil_str: str = None, qiskit_circuit: QuantumCircuit = None):
        if pyquil_program:
            self.import_pyquil(pyquil_program)
        elif quil_str:
            self.import_quil(quil_str)
        elif qiskit_circuit:
            self._set_circuit(qiskit_circuit)
        else:
            self._set_circuit(QuantumCircuit())
            self.qreg_mapping_import = {}
            self.creg_mapping_import = {}
            self.qreg_mapping_export = {}
            self.creg_mapping_export = {}


    def _import(self, handler: ConversionHandler, circuit, is_language):
        if is_language:
            (circuit, self.qreg_mapping_import, self.creg_mapping) = handler.import_language(circuit)
        else:
            (circuit, self.qreg_mapping_import, self.creg_mapping) = handler.import_circuit(circuit)
        self._set_circuit(circuit)

    def _set_circuit(self, circuit: QuantumCircuit):
        self.circuit = circuit
        self.dag = circuit_to_dag(circuit)

    def import_pyquil(self, program: Program) -> None:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        self._import(handler, program, False)

    def import_quil(self, quil: str) -> None:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        self._import(handler, quil, True)

    def _export(self, handler, is_language):
        if is_language:
            (circuit, self.qreg_mapping_export, self.creg_mapping_export) = handler.export_language(self.circuit)
        else:
            (circuit, self.qreg_mapping_export, self.creg_mapping_export) = handler.export_circuit(self.circuit)
        return circuit

    def export_pyquil(self) -> Program:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        return self._export(handler, False)

    def export_quil(self) -> str:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        return self._export(handler, True)

    def decompose_to_standard_gates(self):
        decompose = Decompose()
        decompose._non_standard_gate_nodes(self.dag)
        

        self.dag = decompose.decompose_to_standard_gates(self.dag)
        self.circuit = dag_to_circuit(self.dag)
        show_figure(self.circuit)
