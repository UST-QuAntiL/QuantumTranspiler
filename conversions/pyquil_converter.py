from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
from pytket.pyquil import pyquil_to_tk, tk_to_pyquil
from pyquil import Program
from qiskit import QuantumCircuit
from dag_converter import DagConverter
from qiskit.dagcircuit import DAGCircuit


class PyquilConverter: 
    ## dag converter  
    @staticmethod
    def pyquil_to_dag(program: Program) -> DAGCircuit:
        return DagConverter.qasm_to_dag(PyquilConverter.pyquil_to_qasm(program))
    
    @staticmethod
    def dag_to_pyquil(dag: DAGCircuit) -> Program:
        return PyquilConverter.qasm_to_pyquil(DagConverter.dag_to_qasm(dag))
    
    ## qasm converter
    @staticmethod
    def pyquil_to_qasm(program: Program) -> str:
        circuit = pyquil_to_tk(program)
        return circuit_to_qasm_str(circuit)
    
    @staticmethod
    def qasm_to_pyquil(qasm: str) -> Program:
        circuit = circuit_from_qasm_str(qasm)
        return tk_to_pyquil(circuit)
