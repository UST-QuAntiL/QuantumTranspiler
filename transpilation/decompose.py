from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.Unroller import Unroller
from qiskit.extensions import UnitaryGate

class Decompose():
    def _non_standard_gate_nodes(self, dag):        
        all_nodes = dag.gate_nodes()
        nodes = []
        for node in all_nodes:
            if isinstance(node.op, UnitaryGate):
            # should have same semantic if node.name or node.op instance is checked
            # if node.name == "unitary":
                nodes.append(node)
        return nodes


    def decompose_to_standard_gates(self, dag: DAGCircuit):
        nodes = self._non_standard_gate_nodes(dag) 
        for node in nodes:
            # decomposes 3+ qubit gates to isometry gate instead of decomposition (see https://github.com/Qiskit/qiskit-terra/issues/4231)
            print(node.op.definition)
            decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
            dag = decompose_pass.run(dag)
        return dag
