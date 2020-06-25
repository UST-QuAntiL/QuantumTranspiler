from qiskit.dagcircuit import DAGCircuit
from qiskit.transpiler.passes import Unroll3qOrMore, Unroller, Optimize1qGates
from qiskit.tools.visualization import dag_drawer

class Decompose():
    def decompose_to_standard_gates(self, dag: DAGCircuit):
        dag_drawer(dag)
        # circuit.to_dag()
