from abc import ABC, abstractmethod
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.circuit import Qubit

class ConverterInterface(ABC):
    @property
    @abstractmethod
    def name(self):
        pass

    @property
    @abstractmethod
    def circuit(self):
        pass

    @abstractmethod
    def import_circuit(self, circuit):
        pass   

    @abstractmethod
    def init_circuit(self):
        pass

    @abstractmethod
    def create_qreg_mapping(self, qreg_mapping, qubit: Qubit, index: int):
        pass

    @abstractmethod
    def create_creg_mapping(self, creg_mapping, cr: ClassicalRegister):
        pass

    @abstractmethod
    def gate(self):
        pass

    @abstractmethod
    def custom_gate(self):
        pass

    @abstractmethod
    def parameter_conversion(self):
        pass

    @abstractmethod
    def barrier(self):
        pass

    @abstractmethod
    def measure(self):
        pass

    @abstractmethod
    def subcircuit(self):
        pass  

    @abstractmethod
    def language_to_circuit(self, language: str):
        pass

    @abstractmethod
    def circuit_to_language(self, circuit) -> str:
        pass