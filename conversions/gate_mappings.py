import qiskit.circuit.library.standard_gates as qiskit
import pyquil.gates as pyquil
gate_mapping = [
    # single qubits
    (qiskit.IGate, pyquil.I),    
    (qiskit.XGate, pyquil.X),
    (qiskit.YGate, pyquil.Y),
    (qiskit.ZGate, pyquil.Z),
    (qiskit.HGate, pyquil.H),
    (qiskit.SGate, pyquil.S),
    (qiskit.TGate, pyquil.T),
    # single - parameterized
    (qiskit.RXGate, pyquil.RX),
    (qiskit.RYGate, pyquil.RY),
    (qiskit.RZGate, pyquil.RZ),
    (qiskit.U1Gate, pyquil.PHASE),
    # multi 
    (qiskit.CXGate, pyquil.CNOT),
    (qiskit.CZGate, pyquil.CZ),
    (qiskit.CCXGate, pyquil.CCNOT), 
    (qiskit.SwapGate, pyquil.SWAP),
    # multi - parameterized 
    (qiskit.iSwapGate, pyquil.ISWAP),  
    # quantastica uses crz, pytket uses cu1, they are not equal according to IBM unitarygate equ tho, cu1 == cphase, but crz != cphase
    # according to https://qiskit.org/documentation/stubs/qiskit.circuit.library.CU1Gate.html the relative phase of cu1 != cphase and therefore cphase is wrong in this context
    (qiskit.CU1Gate, pyquil.CPHASE),   
    # TODO CPHASE Gates in qiskit gates)
    # (qiskit.CU1Gate, pyquil.CPHASE00),   
    # (qiskit.CU1Gate, pyquil.CPHASE01), 
    # (qiskit.CU1Gate, pyquil.CPHASE10),       
]  

gate_mapping_qiskit = {}
gate_mapping_pyquil = {}
for qiskit_gate, pyquil_gate in gate_mapping:
    gate_mapping_qiskit[qiskit_gate] = {"pyquil": pyquil_gate}
    gate_mapping_pyquil[pyquil_gate.__name__] = qiskit_gate 

