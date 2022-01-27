from abc import ABC, abstractmethod
from qiskit import QuantumCircuit


class Translator(ABC):


    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def from_language(self, text: str) -> QuantumCircuit:
        pass

    @abstractmethod
    def to_language(self, circuit: QuantumCircuit) -> str:
        pass