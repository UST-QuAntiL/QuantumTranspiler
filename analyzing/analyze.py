from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ
from conversions.dag_converter import DagConverter
from qiskit.test.mock import FakeTenerife  
from qiskit.providers import BaseBackend
from qiskit.compiler import transpile


def get_depth(qasm: str) -> int:
    dag = DagConverter.qasm_to_dag(qasm)
    depth = dag.depth()
    return depth

def get_width(qasm: str) -> int:
    """ 
    Return number of qubits + cbits
    """
    dag = DagConverter.qasm_to_dag(qasm)
    depth = dag.width()
    return depth

def get_num_qubits(qasm: str) -> int:
    """
    Return number of qubits
    """
    dag = DagConverter.qasm_to_dag(qasm)
    depth = dag.num_qubits()
    return depth

def transpile_circuit_qiskit(circuit: QuantumCircuit, backend: BaseBackend) -> QuantumCircuit:    
    return transpile(circuit, backend)

def show_and_save_figure(circuit: QuantumCircuit, filename='circuit.png'):
    circuit.draw(output='mpl', filename=filename)
    print(circuit)


def show_figure(circuit: QuantumCircuit):
    circuit.draw(output='text')
    print(circuit)
    
if __name__ == "__main__":
    circuit = QuantumCircuit(3)
    circuit.ccx(0, 1, 2)
    circuit.h(0)
    backend = FakeTenerife()
    new_circuit = transpile_circuit_qiskit(circuit, backend)
    print(get_depth(new_circuit.qasm()))
    show_figure(new_circuit)

    
    