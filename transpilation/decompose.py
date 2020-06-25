from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.Unroller import Unroller

class Decompose():
    def _non_standard_gate_nodes(self, dag):        
        all_nodes = dag.gate_nodes()
        nodes = []
        for node in all_nodes:
            if node.name == "unitary":
                nodes.append(node)
        return nodes


    def decompose_to_standard_gates(self, dag: DAGCircuit):
        nodes = self._non_standard_gate_nodes(dag) 
        for node in nodes:
            decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
            dag = decompose_pass.run(dag)
        return dag
