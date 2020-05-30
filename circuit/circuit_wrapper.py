from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from conversion.pyquil_converter import PyquilConverter
from pyquil import Program

class CircuitWrapper:
    def __init__(self, pyquil_program: Program = None, quil_str: str = None):
        if pyquil_program:
            self.import_pyquil(pyquil_program)
        if quil_str:
            self.import_quil(quil_str)
        else:
            self.circuit = QuantumCircuit()
            self.qreg_mapping = {}
            self.creg_mapping = {}

    def import_pyquil(self, program: Program) -> None:
        (self.circuit, self.qreg_mapping, self.creg_mapping) = PyquilConverter.import_pyquil(program)

    def import_quil(self, quil: str) -> None:
        (self.circuit, self.qreg_mapping, self.creg_mapping) = PyquilConverter.import_quil(quil)