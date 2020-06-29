from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel
from qiskit.circuit.library.standard_gates import CHGate, U2Gate, CXGate, HGate, XGate, CCXGate, CZGate
from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ

class ExtendSel():
    def __init__(self):
        self.add_all()

    def add_all(self):
        self.cx()

    def cx(self):
        """transformation see https://arxiv.org/pdf/1110.2998.pdf"""
        circuit = QuantumCircuit(2)
        circuit.h(1)
        circuit.cz(0, 1)
        circuit.h(1)
        sel.add_equivalence(CXGate(), circuit)        
