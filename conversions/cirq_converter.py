from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
import cirq
from pytket.cirq import tk_to_cirq, cirq_to_tk
from qiskit.dagcircuit import DAGCircuit
from dag_converter import DagConverter

class CirqConverter: 
    ## dag converter
    @staticmethod
    def cirq_to_dag(circuit: cirq.Circuit) -> DAGCircuit:
        return DagConverter.qasm_to_dag(CirqConverter.cirq_to_qasm(circuit))
    
    @staticmethod
    def dag_to_cirq(dag: DAGCircuit) -> str:
        return CirqConverter.qasm_to_cirq(DagConverter.dag_to_qasm(dag))
        
        
    ## qasm converter
    @staticmethod
    def cirq_to_qasm(circuit: cirq.Circuit) -> str:
        circuit = cirq_to_tk(circuit)
        return circuit_to_qasm_str(circuit)
    
    @staticmethod    
    def qasm_to_cirq(qasm: str) -> cirq.Circuit:
        circuit = circuit_from_qasm_str(qasm)        
        return tk_to_cirq(circuit)
    
    ## quikr
    @staticmethod
    def quirk_to_cirq(url: str) -> cirq.Circuit:
        print(url)
        circuit = cirq.quirk_url_to_circuit(url)
        return circuit