from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.decompose_isometry_gates import DecomposeIsometryGates
from qiskit.extensions import UnitaryGate
from transpilation.Utility import non_standard_gate_nodes
class Decomposer():

    def _decompose_isometry_gates(self, dag: DAGCircuit):
        decompose_pass = DecomposeIsometryGates()
        decompose_pass.run(dag)
        return dag

    def _decompose(self, dag):
        nodes = non_standard_gate_nodes(dag) 
        for node in nodes:
            # decomposes 3+ qubit gates to isometry gate instead of decomposition (see https://github.com/Qiskit/qiskit-terra/issues/4231)
            decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
            dag = decompose_pass.run(dag)
        return dag


    def decompose_to_standard_gates(self, dag: DAGCircuit):
        dag = self._decompose(dag)  
        dag = self._decompose_isometry_gates(dag)   
        # must be run again after decomposing isometry gates if special gates like multiplexer should be decomposed (multiplexer can be introduced by the decomposition of the isometry gates) 
        dag = self._decompose(dag) 

        return dag

    
