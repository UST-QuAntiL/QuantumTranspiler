from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit.dagcircuit import DAGCircuit
from qiskit import QuantumCircuit
from qiskit.extensions import UnitaryGate
import numpy as np

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

def check_matrix_equality(self, matrix1, matrix2) -> bool:
    """checks equality of matrices up to global phase"""
    gate1 = UnitaryGate(matrix1)
    gate2 = UnitaryGate(matrix2)
    return gate1 == gate2

# TODO
# def unitary_to_normal_form(unitary: UnitaryGate) -> UnitaryGate:
    # from IBM Unitary Gate equivalence check
    # if ignore_phase:
    #     # Get phase of first non-zero entry of mat1 and mat2
    #     # and multiply all entries by the conjugate
    #     phases1 = np.angle(mat1[abs(mat1) > atol].ravel(order='F'))
    #     if len(phases1) > 0:
    #         mat1 = np.exp(-1j * phases1[0]) * mat1
    #     phases2 = np.angle(mat2[abs(mat2) > atol].ravel(order='F'))
    #     if len(phases2) > 0:
    #         mat2 = np.exp(-1j * phases2[0]) * mat2
    # return np.allclose(mat1, mat2, rtol=rtol, atol=atol)