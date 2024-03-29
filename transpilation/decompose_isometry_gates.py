# -*- coding: utf-8 -*-

# This code is part of Qiskit.
#
# (C) Copyright IBM 2017, 2018.
#
# This code is licensed under the Apache License, Version 2.0. You may
# obtain a copy of this license in the LICENSE.txt file in the root directory
# of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
#
# Any modifications or derivative works of this code must retain this
# copyright notice, and modified files need to carry a notice indicating
# that they have been altered from the originals.

"""Recursively expands isometry gates.
    Adjusted from Qiskit Unroll3qOrMore Class
"""

from qiskit.transpiler.basepasses import TransformationPass
from qiskit.dagcircuit import DAGCircuit
from qiskit.exceptions import QiskitError
from transpilation.Utility import isometry_gates


class DecomposeIsometryGates:
    def run(self, dag):
        """
        Args:
            dag(DAGCircuit): input dag
        Returns:
            DAGCircuit: output dag without isometry gates
        Raises:
            QiskitError: if a 3q+ gate is not decomposable
        """
        # only change to Qiskit code is iteration over isometry gates instead of all gate nodes
        for node in isometry_gates(dag):
            # TODO: allow choosing other possible decompositions
            rule = node.op.definition
            if not rule:
                raise QiskitError(
                    "Cannot unroll all 3q or more gates. "
                    "No rule to expand instruction %s." % node.op.name
                )

            # hacky way to build a dag on the same register as the rule is defined
            # TODO: need anonymous rules to address wires by index
            decomposition = DAGCircuit()
            qregs = {qb.register for inst in rule for qb in inst[1]}
            cregs = {cb.register for inst in rule for cb in inst[2]}
            for qreg in qregs:
                decomposition.add_qreg(qreg)
            for creg in cregs:
                decomposition.add_creg(creg)
            for inst in rule:
                decomposition.apply_operation_back(*inst)
            decomposition = self.run(decomposition)  # recursively unroll
            dag.substitute_node_with_dag(node, decomposition)
        return dag
