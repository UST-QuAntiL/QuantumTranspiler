from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel
import qiskit.circuit.library.standard_gates as Gates
from qiskit import QuantumCircuit
import numpy as np


class ExtendSel():
    def __init__(self):
        self._add_all()

    def _add_all(self):
        self._cx()
        self._h()
        self._u2()

    def _cx(self):
        """transformation see https://arxiv.org/pdf/1110.2998.pdf"""
        circuit = QuantumCircuit(2)
        circuit.h(1)
        circuit.cz(0, 1)
        circuit.h(1)
        sel.add_equivalence(Gates.CXGate(), circuit)

    def _h(self):
        """TODO"""
        circuit = QuantumCircuit(1)
        circuit.rx(np.pi, 0)
        sel.add_equivalence(Gates.HGate(), circuit)

    def _u2(self):
        """TODO"""
        circuit = QuantumCircuit(1)
        circuit.rx(np.pi, 0)
        sel.add_equivalence(Gates.HGate(), circuit)
