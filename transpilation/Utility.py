from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.Unroller import Unroller
from qiskit.extensions import UnitaryGate
from qiskit.extensions.quantum_initializer.isometry import Isometry
from qiskit.circuit.instruction import Instruction

standard_gates = []

def non_standard_gate_nodes(dag):        
    all_nodes = dag.gate_nodes()
    nodes = []
    for node in all_nodes:
        if isinstance(node.op, UnitaryGate):
            nodes.append(node)
    return nodes

def isometry_gates(dag):        
    all_nodes = dag.multi_qubit_ops()
    nodes = []
    for node in all_nodes:
        if isinstance(node.op, Isometry) or isinstance(node.op, Instruction):
            nodes.append(node)
    return nodes

def standard_gate_nodes(dag):        
        all_nodes = dag.gate_nodes()
        nodes = []
        for node in all_nodes:
            if not isinstance(node.op, UnitaryGate):
                nodes.append(node)
        return nodes