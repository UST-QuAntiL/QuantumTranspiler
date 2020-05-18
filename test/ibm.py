from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ
from qiskit.compiler import transpile
from qiskit.transpiler import PassManager
from qiskit.converters import dag_to_circuit
import matplotlib.pyplot as plt
from qiskit.dagcircuit import DAGCircuit
from qiskit.converters import circuit_to_dag
from qiskit.tools.visualization import dag_drawer
from qiskit.extensions.standard import CHGate, U2Gate, CXGate, HGate, XGate, CCXGate, CZGate
from qiskit.transpiler import passes
from qiskit.compiler import transpile
from qiskit.transpiler import PassManager
from qiskit.transpiler.passes import Decompose, Unroller
from quantastica.qiskit_forest import ForestBackend
import numpy as np
from custom_unroller import Unroller as CustomUnroller
import logging
from qiskit.test.mock import FakeTenerife  
from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel


def show_and_save_figure(circuit, filename='circuit.png'):
    circuit.draw(output='mpl', filename=filename)
    print(circuit)


def show_figure(circuit):
    circuit.draw(output='text')
    print(circuit)


def gate_library():
    tmp_circuit = QuantumCircuit(2)
    tmp_circuit.cz(0, 1)

    CXGate().add_decomposition(tmp_circuit)
    decompositions = sel.get_entry(CXGate())
    for decomposition in decompositions:
        show_figure(decomposition)


def circuit():
    circ = QuantumCircuit(3)
    circ.x(0)
    circ.h(0)
    circ.toffoli(0, 1, 2)
    circ.u3(np.pi, np.pi, np.pi, 0)
    show_figure(circ)
    return circ


def dag_operation(circ):
    dag = circuit_to_dag(circ)
    dag_drawer(dag, filename="dag.png")

    basis = ['u1', 'u2', 'u3', 'cz']
    dag = unroll(dag, basis)

    dag_drawer(dag, filename="dag.png")

    circ = dag_to_circuit(dag)
    show_figure(circ)


def unroll(dag, basis):
    for node in dag.op_nodes():
        basic_insts = ['measure', 'reset', 'barrier', 'snapshot']
        if node.name in basic_insts:
            # TODO: this is legacy behavior.Basis_insts should be removed that these
            #  instructions should be part of the device-reported basis. Currently, no
            #  backend reports "measure", for example.
            continue
        if node.name in basis:  # If already a base, ignore.
            continue

        # TODO: allow choosing other possible decompositions
        try:
            rule = node.op.definition
            # print(rule[0][0])
        except TypeError as err:
            print("error")
            print(node.name)

        if not rule:
            if rule == []:  # empty node
                dag.remove_op_node(node)
                continue

            rule = sel.get_entry(node.op)
            if not rule:
                print("error")
                print("No rule to expand instruction %s." %
                      (node.op.name))

        print(node.op)
        print(rule)

        # Isometry gates definitions can have widths smaller than that of the
        # original gate, in which case substitute_node will raise. Fall back
        # to substitute_node_with_dag if an the width of the definition is
        # different that the width of the node.
        while rule and len(rule) == 1 and len(node.qargs) == len(rule[0][1]):
            if rule[0][0].name in basis:
                dag.substitute_node(node, rule[0][0], inplace=True)
                break

            try:
                rule = rule[0][0].definition
            except TypeError as err:
                print("error")
                print(node.name)

        else:

            decomposition = DAGCircuit()
            qregs = {qb.register for inst in rule for qb in inst[1]}
            cregs = {cb.register for inst in rule for cb in inst[2]}
            for qreg in qregs:
                decomposition.add_qreg(qreg)
            for creg in cregs:
                decomposition.add_creg(creg)
            for inst in rule:
                decomposition.apply_operation_back(*inst)

            # recursively unroll ops
            unrolled_dag = unroll(decomposition, basis)
            dag.substitute_node_with_dag(node, unrolled_dag)
    return dag


def gates():
    h = HGate()
    ccx = CCXGate()
    print(cx.definition)


def dag_default(circ):
    dag = circuit_to_dag(circ)
    dag_drawer(dag, filename="dag.png")

    pass_ = Unroller(['u1', 'u2', 'u3', 'cz'])
    dag = pass_.run(dag)

    c = dag_to_circuit(dag)
    show_figure(c)
    


if __name__ == "__main__":
    # logging.basicConfig(level='DEBUG')
    # logging.getLogger('qiskit.transpiler').setLevel('INFO')

    # gate_library()
    
    c = circuit()
    qasm = c.qasm()
    backend = FakeTenerife()
    new_circuit = transpile(c, backend)

    show_figure(new_circuit)
    
