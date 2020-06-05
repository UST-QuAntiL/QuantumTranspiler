import qiskit.circuit.library.standard_gates as qiskit
import pyquil.gates as pyquil
import numpy as np
from qiskit import QuantumCircuit
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
from conversion.pyquil_replacement_programs import u2_replacement, u3_replacement

gate_mapping = {
    # single qubits
    "I": {"qiskit": qiskit.IGate, "pyquil": {"g": pyquil.I}, "matrix": qiskit.IGate().to_matrix()},    
    "X": {"qiskit": qiskit.XGate, "pyquil": {"g": pyquil.X}, "matrix": qiskit.XGate().to_matrix()},
    "Y": {"qiskit": qiskit.YGate, "pyquil": {"g": pyquil.Y}, "matrix": qiskit.YGate().to_matrix()},
    "Z": {"qiskit": qiskit.ZGate, "pyquil": {"g": pyquil.Z}, "matrix": qiskit.ZGate().to_matrix()},
    "H": {"qiskit": qiskit.HGate, "pyquil": {"g": pyquil.H}, "matrix": qiskit.HGate().to_matrix()},
    "S": {"qiskit": qiskit.SGate, "pyquil": {"g": pyquil.S}, "matrix": qiskit.SGate().to_matrix()},
    "T": {"qiskit": qiskit.TGate, "pyquil": {"g": pyquil.T}, "matrix": qiskit.TGate().to_matrix()},
    # single - parameterized
    "RX": {"qiskit": qiskit.RXGate, "pyquil": {"g": pyquil.RX}},
    "RY": {"qiskit": qiskit.RYGate, "pyquil": {"g": pyquil.RY}},
    "RZ": {"qiskit": qiskit.RZGate, "pyquil": {"g": pyquil.RZ}},
    "U1": {"qiskit": qiskit.U1Gate, "pyquil": {"g": pyquil.PHASE}},
    "U2": {"qiskit": qiskit.U2Gate, "pyquil": {"r": u2_replacement}}, 
    "U3": {"qiskit": qiskit.U3Gate, "pyquil": {"r": u3_replacement}},  
    # multi 
    "CX": {"qiskit": qiskit.CXGate, "pyquil": {"g": pyquil.CNOT}, "matrix": qiskit.CXGate().to_matrix()},
    # CZ matrix not defined in qiskit
    "CZ": {"qiskit": qiskit.CZGate, "pyquil": {"g": pyquil.CZ}, "matrix": np.array([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,-1]
    ], dtype=complex)},
    "CCX": {"qiskit": qiskit.CCXGate, "pyquil": {"g": pyquil.CCNOT}, "matrix": qiskit.CCXGate().to_matrix()},
    "SWAP": {"qiskit": qiskit.SwapGate, "pyquil": {"g": pyquil.SWAP}, "matrix": qiskit.SwapGate().to_matrix()},
    # multi - parameterized 
    "ISWAP": {"qiskit": qiskit.iSwapGate, "pyquil": {"g": pyquil.ISWAP}},  
    # quantastica uses crz, pytket uses cu1, they are not equal according to IBM unitarygate equ tho, cu1 == cphase, but crz != cphase, pennylane does not support CU1 at all
    # according to https://qiskit.org/documentation/stubs/qiskit.circuit.library.CU1Gate.html the relative phase of cu1 != cphase and therefore cphase is wrong in this context
    "CU1": {"qiskit": qiskit.CU1Gate, "pyquil": {"g": pyquil.CPHASE}},  
    
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
    qiskit_dict = value["qiskit"]
    pyquil_dict = value["pyquil"]

    
    if qiskit_dict:
        qiskit_gate = qiskit_dict
        gate_mapping_qiskit[qiskit_gate.__name__] = value

    # dict contains g for a gate and r for a replacement circuit/program
    if pyquil_dict:
        if "g" in pyquil_dict:
            pyquil_gate = pyquil_dict["g"]
            gate_mapping_pyquil[pyquil_gate.__name__] = qiskit_dict 

