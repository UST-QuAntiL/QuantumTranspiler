from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit.dagcircuit import DAGCircuit
from qiskit import QuantumCircuit
from qiskit.extensions import UnitaryGate
import numpy as np
from qiskit.quantum_info.operators.predicates import matrix_equal

# unitary gate just works for user defined gates but not for the gates defined in qiskit.extensions.quantum_initializer  
standard_gates = ["barrier", "c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "crz", "cswap", "cu1", "cu3", "cx", "cy", "cz",
                  "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzz", "rzx", "s", "sdg", "t", "tdg", "u1", "u2", "u3", "x", "y", "z"]

standard_instructions = standard_gates + ["measure"]

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

