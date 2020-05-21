import pennylane as qml
import pennylane_qiskit
import pennylane_forest
from pyquil import Program

class PennylaneConverter:
    @staticmethod
    def quil_to_qasm(circuit: str) -> str:
    
    @staticmethod
    def pyquil_to_qasm(program: Program) -> str:
        return PytketConverter.qasm_to_cirq(DagConverter.dag_to_qasm(dag))
        