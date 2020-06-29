from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel
import qiskit.circuit.library.standard_gates as Gates
from qiskit import QuantumCircuit
import numpy as np
from qiskit.circuit import Parameter
class ExtendSel():
    def __init__(self):
        self._add_all()

    def _add_all(self):
        self._cx()
        self._h()
        self._u2()
        self._u3()

    def _cx(self):
        """https://arxiv.org/pdf/1110.2998.pdf"""
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
        """https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html#qiskit.circuit.library.U2Gate"""
        phi = Parameter("phi")
        lam = Parameter("lam")
        circuit = QuantumCircuit(1)
        circuit.rz(phi + np.pi/2, 0)
        circuit.rx(np.pi/2, 0)
        circuit.rz(lam - np.pi/2, 0)
        sel.add_equivalence(Gates.U2Gate(phi, lam), circuit)

    def _u3(self):
        """https://qiskit.org/documentation/stubs/qiskit.circuit.library.U3Gate.html#qiskit.circuit.library.U3Gate"""
        theta = Parameter("theta")
        phi = Parameter("phi")

        lam = Parameter("lambda")
        circuit = QuantumCircuit(1)
        circuit.rz(phi - np.pi/2, 0)
        circuit.rx(np.pi/2, 0)
        circuit.rz(np.pi - theta, 0)
        circuit.rx(np.pi/2, 0)
        circuit.rz(lam - np.pi/2, 0)
        
        sel.add_equivalence(Gates.U3Gate(theta, phi, lam), circuit)
