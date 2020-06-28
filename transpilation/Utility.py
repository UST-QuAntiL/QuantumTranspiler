from qiskit.dagcircuit import DAGCircuit
import qiskit.transpiler.passes as Qiskit_Passes
from qiskit.tools.visualization import dag_drawer
from transpilation.unroll import Unroller
from qiskit.extensions import UnitaryGate
from qiskit.extensions.quantum_initializer.isometry import Isometry
from qiskit.circuit.instruction import Instruction

standard_gates = ["barrier", "c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "crz", "cswap", "cu1", "cu3", "cx", "cy", "cz",
                  "i", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzz", "rzx", "s", "sdg", "t", "tdg", "u1", "u2", "u3", "x", "y", "z"]


def non_standard_gate_nodes(dag):
    all_nodes = dag.gate_nodes()
    nodes = []
    for node in all_nodes:
        # unitary gate just works for user defined gates but not for the gates defined in qiskit.extensions.quantum_initializer        
        # if isinstance(node.op, UnitaryGate):

        if not (node.name in standard_gates):
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
