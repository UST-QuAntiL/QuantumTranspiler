from qiskit.dagcircuit import DAGCircuit
from qiskit.exceptions import QiskitError
from qiskit.circuit import Gate


class Unroller():
    def unroll_node(self, dag):
        for node in dag.op_nodes(op=Gate, include_directives=False):
            print(node.name)

            if isinstance(node, Gate):
                print(node)

        return dag

        #     basic_insts = ['measure', 'reset', 'barrier', 'snapshot']
        #     if node.name in basic_insts:

        #         # TODO: this is legacy behavior.Basis_insts should be removed that these
        #         #  instructions should be part of the device-reported basis. Currently, no
        #         #  backend reports "measure", for example.
        #         continue
        #     if node.name in self.basis:  # If already a base, ignore.
        #         continue

        #     # TODO: allow choosing other possible decompositions
        #     try:
        #         rule = node.op.definition
        #     except TypeError as err:
        #         raise QiskitError('Error decomposing node {}: {}'.format(node.name, err))

        #     # Isometry gates definitions can have widths smaller than that of the
        #     # original gate, in which case substitute_node will raise. Fall back
        #     # to substitute_node_with_dag if an the width of the definition is
        #     # different that the width of the node.
        #     while rule and len(rule) == 1 and len(node.qargs) == len(rule[0][1]):
        #         if rule[0][0].name in self.basis:
        #             dag.substitute_node(node, rule[0][0], inplace=True)
        #             break
        #         try:
        #             rule = rule[0][0].definition
        #         except TypeError as err:
        #             raise QiskitError('Error decomposing node {}: {}'.format(node.name, err))

        #     else:
        #         if not rule:
        #             if rule == []:  # empty node
        #                 dag.remove_op_node(node)
        #                 continue
        #             # opaque node
        #             raise QiskitError("Cannot unroll the circuit to the given basis, %s. "
        #                               "No rule to expand instruction %s." %
        #                               (str(self.basis), node.op.name))

        #         # hacky way to build a dag on the same register as the rule is defined
        #         # TODO: need anonymous rules to address wires by index
        #         decomposition = DAGCircuit()
        #         qregs = {qb.register for inst in rule for qb in inst[1]}
        #         cregs = {cb.register for inst in rule for cb in inst[2]}
        #         for qreg in qregs:
        #             decomposition.add_qreg(qreg)
        #         for creg in cregs:
        #             decomposition.add_creg(creg)
        #         for inst in rule:
        #             decomposition.apply_operation_back(*inst)

        #         unrolled_dag = self.run(decomposition)  # recursively unroll ops
        #         dag.substitute_node_with_dag(node, unrolled_dag)

        # return dag
