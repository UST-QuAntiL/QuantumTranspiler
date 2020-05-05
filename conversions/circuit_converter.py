from pytket.qasm import circuit_to_qasm_str, circuit_from_qasm_str
from qiskit import QuantumCircuit
from pytket.pyquil import pyquil_to_tk, tk_to_pyquil
from pyquil import Program
from qiskit import QuantumCircuit
from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit.dagcircuit import DAGCircuit

class CircuitConverter: 
    ## to dag converter 
    @staticmethod
    def qiskit_to_dag(circuit: QuantumCircuit) -> DAGCircuit:
        return CircuitConverter.qasm_to_dag(CircuitConverter.qiskit_to_qasm(circuit))
    
    @staticmethod
    def pyquil_to_dag(program: Program) -> DAGCircuit:
        return CircuitConverter.qasm_to_dag(CircuitConverter.pyquil_to_qasm(program))
    
    ## from dag converter
    @staticmethod
    def dag_to_qiskit(dag: DAGCircuit) -> QuantumCircuit:
        return dag_to_circuit(dag)
    
    @staticmethod
    def dag_to_pyquil(dag: DAGCircuit) -> Program:
        return CircuitConverter.qasm_to_pyquil(CircuitConverter.dag_to_qasm(dag))
    
    
    ## utility methods
    @staticmethod
    def pyquil_to_qasm(program: Program) -> str:
        circuit = pyquil_to_tk(program)
        return circuit_to_qasm_str(circuit)

    @staticmethod
    def qiskit_to_qasm(circuit: QuantumCircuit) -> str:
        return circuit.qasm()
    
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
    def qasm_to_qiskit(qasm: str) -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(qasm)  
    
    @staticmethod
    def qasm_to_pyquil(qasm: str) -> Program:
        circuit = circuit_from_qasm_str(qasm)
        return tk_to_pyquil(circuit)
        

    
    # @staticmethod
    # def pyquil_to_qasm(program: Program) -> str:
