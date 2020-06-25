from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.unroll_isometry_gates import UnrollIsometryGates
from qiskit.extensions import UnitaryGate
from transpilation.Utility import non_standard_gate_nodes
class Decompose():

    def decompose_isometry_gates(self, dag: DAGCircuit):
        unroll_pass = UnrollIsometryGates()
        unroll_pass.run(dag)
        return dag

    def decompose_to_standard_gates(self, dag: DAGCircuit):
          

        nodes = non_standard_gate_nodes(dag) 
        for node in nodes:
            # decomposes 3+ qubit gates to isometry gate instead of decomposition (see https://github.com/Qiskit/qiskit-terra/issues/4231)
            decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
            dag = decompose_pass.run(dag)

        dag = self.decompose_isometry_gates(dag)   

        nodes = non_standard_gate_nodes(dag) 
        for node in nodes:
            # decomposes 3+ qubit gates to isometry gate instead of decomposition (see https://github.com/Qiskit/qiskit-terra/issues/4231)
            decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
            dag = decompose_pass.run(dag)

        print(dag.gate_nodes())
        for node in dag.op_nodes():
            print(node.op)


        return dag

