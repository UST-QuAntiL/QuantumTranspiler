from numpy.lib.arraysetops import isin
from qiskit.dagcircuit import DAGCircuit, DAGNode
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.unroll import Unroller
from qiskit.extensions import UnitaryGate
from qiskit.extensions.quantum_initializer.isometry import Isometry
from qiskit.circuit.instruction import Instruction
from typing import Callable

# unitary gate just works for user defined gates but not for the gates defined in qiskit.extensions.quantum_initializer        
standard_gates = ["barrier", "c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "crz", "cswap", "cu1", "cu3", "cx", "cy", "cz",
                  "i", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzz", "rzx", "s", "sdg", "t", "tdg", "u1", "u2", "u3", "x", "y", "z"]

def _get_nodes(dag: DAGCircuit, check_node: Callable[[DAGNode], bool]):
    all_nodes = dag.gate_nodes()
    nodes = []
    for node in all_nodes:
        if check_node(node):
            nodes.append(node)
    return nodes

def standard_gate_nodes(dag: DAGCircuit):
    check_node = lambda node: True if (node.name in standard_gates) else False    
    return _get_nodes(dag, check_node)

def non_standard_gate_nodes(dag: DAGCircuit):
    check_node = lambda node: True if (not (node.name in standard_gates)) else False    
    return _get_nodes(dag, check_node)

def custom_3qubit_gates(dag: DAGCircuit):
    check_node = lambda node: True if (node.op.num_qubits >= 3) else False    
    return _get_nodes(dag, check_node)

def quantum_initializer_gates(dag: DAGCircuit):
    check_node = lambda node: True if ((not (isinstance(node.op, UnitaryGate)) and (not (node.name) in standard_gate_nodes))) else False   
    return _get_nodes(dag, check_node) 

def isometry_gates(dag: DAGCircuit):
    all_nodes = dag.multi_qubit_ops()
    nodes = []
    for node in all_nodes:
        if isinstance(node.op, Isometry) or isinstance(node.op, Instruction):
            nodes.append(node)
    return nodes


