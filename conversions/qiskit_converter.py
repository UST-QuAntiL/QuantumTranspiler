from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
from qiskit import QuantumCircuit
from dag_converter import DagConverter
from qiskit.dagcircuit import DAGCircuit
from qiskit.converters import dag_to_circuit

class QiskitConverter: 
    ## dag converter 
    @staticmethod
    def qiskit_to_dag(circuit: QuantumCircuit) -> DAGCircuit:
        return DagConverter.qasm_to_dag(QiskitConverter.qiskit_to_qasm(circuit))    
  
    @staticmethod
    def dag_to_qiskit(dag: DAGCircuit) -> QuantumCircuit:
        return dag_to_circuit(dag)
    
    ## qasm methods
    @staticmethod
    def qiskit_to_qasm(circuit: QuantumCircuit) -> str:
        return circuit.qasm()
    
    @staticmethod
    def qasm_to_qiskit(qasm: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(qasm)  
