import qiskit.circuit.library.standard_gates as qiskit
import pyquil.gates as pyquil
import numpy as np
gate_mapping = {
    # single qubits
    "I": {"qiskit": qiskit.IGate, "pyquil": pyquil.I, "matrix": qiskit.IGate().to_matrix()},    
    "X": {"qiskit": qiskit.XGate, "pyquil": pyquil.X, "matrix": qiskit.IGate().to_matrix()},
    "Y": {"qiskit": qiskit.YGate, "pyquil": pyquil.Y, "matrix": qiskit.IGate().to_matrix()},
    "Z": {"qiskit": qiskit.ZGate, "pyquil": pyquil.Z, "matrix": qiskit.IGate().to_matrix()},
    "H": {"qiskit": qiskit.HGate, "pyquil": pyquil.H, "matrix": qiskit.IGate().to_matrix()},
    "S": {"qiskit": qiskit.SGate, "pyquil": pyquil.S, "matrix": qiskit.IGate().to_matrix()},
    "T": {"qiskit": qiskit.TGate, "pyquil": pyquil.T, "matrix": qiskit.IGate().to_matrix()},
    # single - parameterized
    "RX": {"qiskit": qiskit.RXGate, "pyquil": pyquil.RX},
    "RY": {"qiskit": qiskit.RYGate, "pyquil": pyquil.RY},
    "RZ": {"qiskit": qiskit.RZGate, "pyquil": pyquil.RZ},
    "U1": {"qiskit": qiskit.U1Gate, "pyquil": pyquil.PHASE},
    # multi 
    "CX": {"qiskit": qiskit.CXGate, "pyquil": pyquil.CNOT, "matrix": qiskit.CXGate().to_matrix()},
    # CZ matrix not defined in qiskit
    "CZ": {"qiskit": qiskit.CZGate, "pyquil": pyquil.CZ, "matrix": np.array([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,-1]
    ], dtype=complex)},
    "CCX": {"qiskit": qiskit.CCXGate, "pyquil": pyquil.CCNOT, "matrix": qiskit.CCXGate().to_matrix()},
    "SWAP": {"qiskit": qiskit.SwapGate, "pyquil": pyquil.SWAP, "matrix": qiskit.SwapGate().to_matrix()},
    # multi - parameterized 
    "ISWAP": {"qiskit": qiskit.iSwapGate, "pyquil": pyquil.ISWAP},  
    # quantastica uses crz, pytket uses cu1, they are not equal according to IBM unitarygate equ tho, cu1 == cphase, but crz != cphase
    # according to https://qiskit.org/documentation/stubs/qiskit.circuit.library.CU1Gate.html the relative phase of cu1 != cphase and therefore cphase is wrong in this context
    "CU1": {"qiskit": qiskit.CU1Gate, "pyquil": pyquil.CPHASE},   
    # TODO CPHASE Gates in qiskit gates)
    # (qiskit.CU1Gate, pyquil.CPHASE00),   
    # (qiskit.CU1Gate, pyquil.CPHASE01), 
    # (qiskit.CU1Gate, pyquil.CPHASE10),   

    # TODO gates from https://qiskit.org/documentation/apidoc/circuit_library.html?highlight=circuit%20library
    "C3XGate": {"qiskit": qiskit.C3XGate, "pyquil": None,"matrix": np.array([[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]], dtype=complex)},
    # "C4XGate": {"qiskit": qiskit.C3XGate, "pyquil": (), "matrix": []}
}
 
gate_mapping_qiskit = {}
gate_mapping_pyquil = {}
for key, value in gate_mapping.items():
    qiskit_gate = value["qiskit"]
    pyquil_gate = value["pyquil"]
    # tuple gate are replacements and therefore not added as key
    if qiskit_gate:
        if not (isinstance(qiskit_gate, tuple)):
            gate_mapping_qiskit[qiskit_gate.__name__] = value
    if pyquil_gate:
        if not (isinstance(pyquil_gate, tuple)):
            gate_mapping_pyquil[pyquil_gate.__name__] = qiskit_gate 

