from pytket.qasm import circuit_from_qasm_str, circuit_to_qasm_str
from pytket.pyquil import pyquil_to_tk
from pytket.qiskit import qiskit_to_tk

from pyquil import Program, get_qc
from pyquil.gates import *
from ibm import show_figure
from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ
from pytket.backends.ibm import AerBackend
from pytket.backends.forest import ForestBackend
from pytket.circuit import Circuit, Node, Op, OpType, Qubit
import numpy as np
from qiskit.extensions.standard import CHGate, U2Gate, CnotGate, HGate, XGate, ToffoliGate, CCXGate
# import search_compiler as sc

def show_ket_circuit(circuit: Circuit):
    circuit = QuantumCircuit.from_qasm_str(circuit_to_qasm_str(circuit, "circuit.qasm"))
    show_figure(circuit)

""" search_compiler """
# compiler = sc.SearchCompiler()
# U3 = sc.QiskitU3QubitStep()
# CNOT = sc.CNOTStep()
# toffoliGate = CCXGate()
# target_unitary = toffoliGate.to_matrix() 
# circuit, vector = compiler.compile(target_unitary)

# myqasm = sc.assembler.assemble(circuit, vector, sc.assembler.ASSEMBLY_IBMOPENQASM)

# circuit = QuantumCircuit.from_qasm_str(myqasm)
# show_figure(circuit)

""" pytket compiler """
circ = QuantumCircuit(3, 2)
# circ.u3(np.pi*0.1,np.pi * 0.2,np.pi * 0.5,0)
# circ.cx(0, 1)
# circ.measure(0, 0)
toffoliGate = CCXGate()
circ.ccx(0,1,2)
c = qiskit_to_tk(circ)

show_ket_circuit(c)

# b = AerBackend()    
b= ForestBackend("Aspen-7-28Q-A")           
b.compile_circuit(c)

show_ket_circuit(c)


