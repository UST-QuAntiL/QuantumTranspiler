from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit.dagcircuit import DAGCircuit
from qiskit import QuantumCircuit
from qiskit.extensions import UnitaryGate
import numpy as np
from qiskit.quantum_info.operators.predicates import matrix_equal

def qasm_to_dag(qasm: str) -> DAGCircuit:
    circuit = QuantumCircuit.from_qasm_str(qasm)
    dag = circuit_to_dag(circuit)
    return dag

def dag_to_qasm(dag: DAGCircuit) -> str:
    circuit = dag_to_circuit(dag)
    return circuit.qasm()

def write_qasm(qasm: str, filename: str) -> None:
    with open(filename, "w") as f:       
        f.write(qasm)

def show_figure(circuit: QuantumCircuit) -> None:   
    circuit.draw(output='text')
    print(circuit)        

def check_matrix_equality(self, matrix1: np.array, matrix2: np.array) -> bool:
    """checks equality of matrices up to global phase"""
    return matrix_equal(matrix1, matrix2, ignore_phase=True)