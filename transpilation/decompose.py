import copy
from typing import Callable, List
from qiskit.circuit.gate import Gate
from qiskit.circuit.instruction import Instruction
from qiskit.circuit.quantumcircuit import QuantumCircuit
from qiskit.converters.dag_to_circuit import dag_to_circuit
from qiskit.dagcircuit import DAGCircuit, DAGNode
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.decompose_isometry_gates import DecomposeIsometryGates
from qiskit.extensions import UnitaryGate
from transpilation.Utility import isometry_gates, non_standard_gate_nodes, custom_3qubit_gates, non_standard_non_unitary_gates

class Decomposer():
    def decompose_to_standard_gates(self, dag: DAGCircuit):
        dag = self._decompose(dag, non_standard_gate_nodes)  
        dag = self.decompose_isometry_gates(dag)       
        return dag  

    def _decompose(self, dag: DAGCircuit, get_nodes: Callable[[DAGCircuit], List[DAGNode]]):
        old_nodes = []
        nodes = get_nodes(dag) 
        while (len(nodes) > 0) and (old_nodes != nodes):
            old_nodes = nodes
            for node in nodes: 
                # some gates are defined by quantum circuits that do not have any operations (happens e.g. in shor_general(3))   
                if isinstance(node.op, Instruction):
                    definition = node.op.definition
                    if isinstance(definition, QuantumCircuit):   
                        if len(definition.data) == 0:
                            dag.remove_op_node(node)
                            
                decompose_pass = Qiskit_Passes.Decompose(node.op.__class__)
                dag = decompose_pass.run(dag)
                nodes = get_nodes(dag) 
                # circuit = dag_to_circuit(dag)
                # # print(circuit)
        return dag
        

    def decompose_isometry_gates(self, dag: DAGCircuit):
        dag = self._decompose(dag, isometry_gates)
        # must be run after decomposing isometry gates if special gates like multiplexer should be decomposed (multiplexer can be introduced by the decomposition of the isometry gates) 
        dag = self.decompose_non_standard_non_unitary_gates(dag)                   
        return dag

    def decompose_non_standard_non_unitary_gates(self, dag: DAGCircuit):
        dag = self._decompose(dag, non_standard_non_unitary_gates)              
        return dag

    


    

    
