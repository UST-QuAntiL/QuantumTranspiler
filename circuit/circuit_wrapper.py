from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from conversion.converter.converter_interface import ConverterInterface
from conversion.converter.pyquil_converter import PyquilConverter
from pyquil import Program

class CircuitWrapper:
    def __init__(self, pyquil_program: Program = None, quil_str: str = None, qiskit_circuit: QuantumCircuit = None):
        if pyquil_program:
            self.import_pyquil(pyquil_program)
        if quil_str:
            self.import_quil(quil_str)
        if qiskit_circuit:
            self.circuit = qiskit_circuit
        else:
            self.circuit = QuantumCircuit()
            self.qreg_mapping_import = {}
            self.creg_mapping_import = {}
            self.qreg_mapping_export = {}
            self.creg_mapping_export = {}

    def import_pyquil(self, program: Program) -> None:
        (self.circuit, self.qreg_mapping_import, self.creg_mapping) = PyquilConverter.import_pyquil(program)

    def import_quil(self, quil: str) -> None:
        (self.circuit, self.qreg_mapping_import, self.creg_mapping) = PyquilConverter.import_quil(quil)

    def export_pyquil(self) -> Program:
        (program, self.qreg_mapping_export, self.creg_mapping_export) = PyquilConverter.export_pyquil(self.circuit)
        return program

    def export_quil(self) -> str:
        (quil, self.qreg_mapping_export, self.creg_mapping_export) = PyquilConverter.export_quil(self.circuit)
        return quil