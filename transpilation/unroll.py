from qiskit.dagcircuit import DAGCircuit
from qiskit.exceptions import QiskitError
from qiskit.circuit import Gate
from circuit.qiskit_utility import show_figure
from qiskit.transpiler.basepasses import TransformationPass
from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel

class Unroller(TransformationPass):
    def __init__(self, basis):
        """Unroller initializer.

        Args:
            basis (list[str] or None): Target basis names to unroll to, e.g. `['u3', 'cx']` . If
                None, does not unroll any gate.
        """
        super().__init__()
        self.basis = basis
  

    def _check_node_basis(self, node) -> bool:

        if node is None:
            return False

        if node.name in self.basis:
            return True         

        else:
            return False 

    

    def _get_rules(self, gate):
        try:
            rules = []
            rule = gate.definition
            rules.append(rule)
            
            circuits = sel.get_entry(gate)
            for rule in circuits:
                rules.append(rule)   

            return rules       

        except TypeError as err:
            raise QiskitError('Error decomposing node {}: {}'.format(gate.name, err))


    def _get_rule(self, gate):
        rules = self._get_rules(gate)
        first_rule = None
        for rule in rules:
            if rule is None:
                continue
            if first_rule is None:
                first_rule = rule

            is_basis = self._check_node_basis(rule[0][0])
            if is_basis:
                return rule

        return first_rule




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
        if self.basis is None:
            return dag

        # Walk through the DAG and expand each non-basis node
        for node in dag.op_nodes():
            basic_insts = ['measure', 'reset', 'barrier', 'snapshot']
            if node.name in basic_insts:
                continue
            if node.name in self.basis:  # If already a base, ignore.
                continue

            rule = self._get_rule(node.op)

            # Isometry gates definitions can have widths smaller than that of the
            # original gate, in which case substitute_node will raise. Fall back
            # to substitute_node_with_dag if an the width of the definition is
            # different that the width of the node.
            while rule and len(rule) == 1 and len(node.qargs) == len(rule[0][1]): 
                gate = rule[0][0]
                if gate.name in self.basis:
                    dag.substitute_node(node, rule[0][0], inplace=True)
                    break
                try:                    
                    rule = self._get_rule(gate)
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
                unrolled_dag = self.run(decomposition)  # recursively unroll ops
                dag.substitute_node_with_dag(node, unrolled_dag)

        return dag

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
