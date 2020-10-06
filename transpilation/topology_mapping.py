from qiskit.converters.circuit_to_dag import circuit_to_dag
from qiskit.converters.dag_to_circuit import dag_to_circuit
from qiskit.dagcircuit.dagcircuit import DAGCircuit
from qiskit.transpiler.passes import BasicSwap, FullAncillaAllocation, CXDirection, ApplyLayout, DenseLayout, LookaheadSwap, StochasticSwap, EnlargeWithAncilla
from qiskit import QuantumCircuit
from qiskit.transpiler import CouplingMap
from qiskit.transpiler.passes.layout.trivial_layout import TrivialLayout
from qiskit.transpiler.passmanager import PassManager


def swap(circuit: DAGCircuit, coupling: CouplingMap):    
    # embedding is needed for the swap algorithm
    passes = [DenseLayout(coupling_map=coupling), FullAncillaAllocation(coupling), EnlargeWithAncilla(), ApplyLayout(), LookaheadSwap(coupling_map=coupling)]
    pass_manager = PassManager(passes)           
    transpiled_circuit = pass_manager.run(circuit)
    return transpiled_circuit

def swap_direction(circuit: DAGCircuit, coupling: CouplingMap):
    if not coupling.is_symmetric:
        cxDirection = [CXDirection(coupling)]
        pass_manager = PassManager(cxDirection)
        transpiled_circuit = pass_manager.run(circuit)
        return transpiled_circuit
    else:
        return circuit
    