from qiskit.converters.circuit_to_dag import circuit_to_dag
from qiskit.converters.dag_to_circuit import dag_to_circuit
from qiskit.dagcircuit.dagcircuit import DAGCircuit
from qiskit.transpiler.passes import BasicSwap, LookaheadSwap, StochasticSwap
from qiskit import QuantumCircuit
from qiskit.transpiler import CouplingMap
from qiskit.transpiler.passmanager import PassManager

def swap(dag: DAGCircuit, coupling: CouplingMap):
    swap = BasicSwap(coupling_map=coupling)
    transpiled_dag = swap.run(dag)
    return transpiled_dag