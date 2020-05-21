from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit.dagcircuit import DAGCircuit
from qiskit import QuantumCircuit

class DagConverter:
    @staticmethod
    def qasm_to_dag(qasm: str) -> DAGCircuit:
        circuit = QuantumCircuit.from_qasm_str(qasm)
        dag = circuit_to_dag(circuit)
        return dag
    
    @staticmethod
    def dag_to_qasm(dag: DAGCircuit) -> str:
        circuit = dag_to_circuit(dag)
        return circuit.qasm()

    @staticmethod 
    def write_qasm(qasm: str, filename: str) -> None:
        with open(filename, "w") as f:       
            f.write(qasm)
        
        