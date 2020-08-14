from qiskit.dagcircuit import DAGCircuit
from qiskit.dagcircuit.dagnode import DAGNode
from qiskit.exceptions import QiskitError
from qiskit.circuit import Gate
from qiskit.extensions.unitary import UnitaryGate
from circuit.qiskit_utility import show_figure
from qiskit.transpiler.basepasses import TransformationPass
from transpilation.equivalence_library import EquivalenceLibraryBasis
import numpy as np
from qiskit.quantum_info.synthesis.two_qubit_decompose import TwoQubitBasisDecomposer

class Unroller(TransformationPass):
    def __init__(self, basis):
        """Unroller initializer.

        Args:
            basis (list[str] or None): Target basis names to unroll to, e.g. `['u3', 'cx']` . If
                None, does not unroll any gate.
        """
        super().__init__()
        self._el = EquivalenceLibraryBasis(basis)
        # basis contains the names of all specified gates
        self.basis = basis


    def _get_rules(self, gate):
        rules = self._el.get_entry(gate)
        if rules is None or rules == []:
            try:
                rules = []
                rule = gate.definition
                rules.append(rule)      

            except TypeError as err:
                raise QiskitError('Error decomposing node {}: {}'.format(gate.name, err))

        return rules
        


    def run(self, dag):
        """Run an adjusted Qiskit Unroller pass on `dag`.

        Args:
            dag (DAGCircuit): input dag

        Raises:
            QiskitError: if unable to unroll given the basis due to undefined
            decomposition rules (such as a bad basis) or excessive recursion.

        Returns:
            DAGCircuit: output unrolled dag
        """
        if "cz" in self.basis:
            self.replace_definition_cz(dag)
            
        dag = self.unroll_to_basis(dag)
        return dag

    def replace_definition_cz(self, dag: DAGCircuit) -> None:
        """by default custom two qubit gates are defined by CX and 1Qubit Gates
        this method replaces the definition by a definition consisting of CZ and 1Qubit Gates
        """
        cz_matrix = np.array([[1, 0, 0, 0],
                           [0, 1, 0, 0],
                           [0, 0, 1, 0],
                           [0, 0, 0, -1]], dtype=complex)
        cz_gate = UnitaryGate(cz_matrix)
        two_qubit_cz_decompose = TwoQubitBasisDecomposer(cz_gate)

        for node in dag.op_nodes():
            gate = node.op
            if isinstance(gate, UnitaryGate) and gate.num_qubits == 2:  
                gate.definition = two_qubit_cz_decompose(gate.to_matrix()).data
        

    def unroll_to_basis(self, dag: DAGCircuit) -> DAGCircuit:
        if self.basis is None:
            return dag

        # Walk through the DAG and expand each non-basis node
        for node in dag.op_nodes():
            basic_insts = ['measure', 'reset', 'barrier', 'snapshot']
            if node.name in basic_insts:
                continue
            if node.name in self.basis:  # If already a base, ignore.
                continue
            
            rules = self._get_rules(node.op)
            self._apply_rules(dag, node, rules)    

        return dag

    def _apply_rules(self, dag: DAGCircuit, node: DAGNode, rules) -> None:
        for rule in rules:
            try:
                # Isometry gates definitions can have widths smaller than that of the
                # original gate, in which case substitute_node will raise. Fall back
                # to substitute_node_with_dag if an the width of the definition is
                # different that the width of the node.
                if rule and len(rule) == 1 and len(node.qargs) == len(rule[0][1]): 
                    gate = rule[0][0]
                    if gate.name in self.basis:
                        dag.substitute_node(node, rule[0][0], inplace=True)
                        return
                    try:                    
                        rules = self._get_rules(gate)
                        self._apply_rules(dag, node, rules)
                        return
                    except TypeError as err:
                        raise QiskitError('Error decomposing node {}: {}'.format(node.name, err))

                else:
                    if not rule:
                        if rule == []:  # empty node
                            dag.remove_op_node(node)
                            continue
                        # opaque node
                        raise QiskitError("Cannot unroll the circuit to the given basis, %s. "
                                        "No rule to expand instruction %s." %
                                        (str(self.basis), node.op.name))

                    
                    decomposition = self._rule_to_dag(rule)
                    unrolled_dag = self.unroll_to_basis(decomposition)  # recursively unroll ops
                    dag.substitute_node_with_dag(node, unrolled_dag)
                    return

            except QiskitError as err:
                print(err)
                continue

        raise QiskitError("Cannot unroll the circuit to the given basis, %s. "
                                        "No rule to expand instruction %s." %
                                        (str(self.basis), node.op.name))

    def _rule_to_dag(self, rule) -> DAGCircuit:
        # hacky way to build a dag on the same register as the rule is defined
        decomposition = DAGCircuit()
        qregs = {qb.register for inst in rule for qb in inst[1]}
        cregs = {cb.register for inst in rule for cb in inst[2]}
        for qreg in qregs:
            decomposition.add_qreg(qreg)
        for creg in cregs:
            decomposition.add_creg(creg)
        for inst in rule:
            decomposition.apply_operation_back(*inst)        
        return decomposition

