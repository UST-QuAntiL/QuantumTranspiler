from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
from pytket.qiskit import tk_to_qiskit
import cirq
from pytket.cirq import tk_to_cirq, cirq_to_tk
from qiskit.dagcircuit import DAGCircuit
from qiskit.converters import circuit_to_dag, dag_to_circuit
from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
from pytket.pyquil import pyquil_to_tk, tk_to_pyquil
from pyquil import Program
from qiskit import QuantumCircuit
from qiskit_utility import qasm_to_dag, dag_to_qasm
from qiskit.dagcircuit import DAGCircuit

class PytketConverter: 
    """
        not supported:
            - from qasm: cu1 gates 
    """
    @staticmethod
    def cirq_to_dag(circuit: cirq.Circuit) -> DAGCircuit:
        return qasm_to_dag(PytketConverter.cirq_to_qasm(circuit))
    
    @staticmethod
    def dag_to_cirq(dag: DAGCircuit) -> str:
        return PytketConverter.qasm_to_cirq(dag_to_qasm(dag))
        
        
    @staticmethod
    def cirq_to_qasm(circuit: cirq.Circuit) -> str:
        circuit = cirq_to_tk(circuit)
        return circuit_to_qasm_str(circuit)
    
    @staticmethod    
    def qasm_to_cirq(qasm: str) -> cirq.Circuit:
        circuit = circuit_from_qasm_str(qasm)        
        return tk_to_cirq(circuit)
    
    @staticmethod
    def quirk_to_cirq(url: str) -> cirq.Circuit:
        print(url)
        circuit = cirq.quirk_url_to_circuit(url)
        return circuit

    @staticmethod
    def pyquil_to_dag(program: Program) -> DAGCircuit:
        return qasm_to_dag(PytketConverter.pyquil_to_qasm(program))
    
    @staticmethod
    def dag_to_pyquil(dag: DAGCircuit) -> Program:
        return PytketConverter.qasm_to_pyquil(dag_to_qasm(dag))
    
    @staticmethod
    def pyquil_to_qasm(program: Program) -> str:
        circuit = pyquil_to_tk(program)
        return circuit_to_qasm_str(circuit)
    
    @staticmethod
    def qasm_to_pyquil(qasm: str) -> Program:
        circuit = circuit_from_qasm_str(qasm)
        return tk_to_pyquil(circuit)

    @staticmethod
    def qiskit_to_dag(circuit: QuantumCircuit) -> DAGCircuit:
        return qasm_to_dag(PytketConverter.qiskit_to_qasm(circuit))    
  
    @staticmethod
    def dag_to_qiskit(dag: DAGCircuit) -> QuantumCircuit:
        return dag_to_circuit(dag)
    
    @staticmethod
    def qiskit_to_qasm(circuit: QuantumCircuit) -> str:
        return circuit.qasm()
    
    @staticmethod
    def qasm_to_qiskit(qasm: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(qasm)  

    @staticmethod
    def pyquil_to_qiskit(program: Program) -> QuantumCircuit:
        circuit = pyquil_to_tk(program)
        return tk_to_qiskit(circuit)