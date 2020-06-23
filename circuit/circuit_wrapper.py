from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from conversion.conversion_handler import ConversionHandler
from conversion.converter.pyquil_converter import PyquilConverter
from pyquil import Program

class CircuitWrapper:
    def __init__(self, pyquil_program: Program = None, quil_str: str = None, qiskit_circuit: QuantumCircuit = None):
        if pyquil_program:
            self.import_pyquil(pyquil_program)
        elif quil_str:
            self.import_quil(quil_str)
        elif qiskit_circuit:
            self.circuit = qiskit_circuit
        else:
            self.circuit = QuantumCircuit()
            self.qreg_mapping_import = {}
            self.creg_mapping_import = {}
            self.qreg_mapping_export = {}
            self.creg_mapping_export = {}


    def _import(self, handler: ConversionHandler, circuit, is_language):
        if is_language:
            (self.circuit, self.qreg_mapping_import, self.creg_mapping) = handler.import_language(circuit)
        else:
            (self.circuit, self.qreg_mapping_import, self.creg_mapping) = handler.import_circuit(circuit)

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