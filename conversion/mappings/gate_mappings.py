import qiskit.circuit.library.standard_gates as qiskit
import pyquil.gates as pyquil
import numpy as np
from qiskit import QuantumCircuit
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
from conversion.mappings.replacement_pyquil import u2_replacement, u3_replacement, c3x_replacement
from conversion.mappings.replacement_qiskit import cphase00_replacement, cphase01_replacement, cphase10_replacement

gate_mapping = {
    # single qubits
    "I": {"qiskit": {"g": qiskit.IGate}, "pyquil": {"g": pyquil.I}, "matrix": qiskit.IGate().to_matrix()},    
    "X": {"qiskit": {"g": qiskit.XGate}, "pyquil": {"g": pyquil.X}, "matrix": qiskit.XGate().to_matrix()},
    "Y": {"qiskit": {"g": qiskit.YGate}, "pyquil": {"g": pyquil.Y}, "matrix": qiskit.YGate().to_matrix()},
    "Z": {"qiskit": {"g": qiskit.ZGate}, "pyquil": {"g": pyquil.Z}, "matrix": qiskit.ZGate().to_matrix()},
    "H": {"qiskit": {"g": qiskit.HGate}, "pyquil": {"g": pyquil.H}, "matrix": qiskit.HGate().to_matrix()},
    "S": {"qiskit": {"g": qiskit.SGate}, "pyquil": {"g": pyquil.S}, "matrix": qiskit.SGate().to_matrix()},
    "T": {"qiskit": {"g": qiskit.TGate}, "pyquil": {"g": pyquil.T}, "matrix": qiskit.TGate().to_matrix()},
    # single - parameterized
    "RX": {"qiskit": {"g": qiskit.RXGate}, "pyquil": {"g": pyquil.RX}},
    "RY": {"qiskit": {"g": qiskit.RYGate}, "pyquil": {"g": pyquil.RY}},
    "RZ": {"qiskit": {"g": qiskit.RZGate}, "pyquil": {"g": pyquil.RZ}},
    "U1": {"qiskit": {"g": qiskit.U1Gate}, "pyquil": {"g": pyquil.PHASE}},
    "U2": {"qiskit": {"g": qiskit.U2Gate}, "pyquil": {"r": u2_replacement}}, 
    "U3": {"qiskit": {"g": qiskit.U3Gate}, "pyquil": {"r": u3_replacement}},  
    # multi 
    "CX": {"qiskit": {"g": qiskit.CXGate}, "pyquil": {"g": pyquil.CNOT}, "matrix": qiskit.CXGate().to_matrix()},
    # CZ matrix not defined in qiskit
    "CZ": {"qiskit": {"g": qiskit.CZGate}, "pyquil": {"g": pyquil.CZ}, "matrix": np.array([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,-1]
    ], dtype=complex)},
    "CCX": {"qiskit": {"g": qiskit.CCXGate}, "pyquil": {"g": pyquil.CCNOT}, "matrix": qiskit.CCXGate().to_matrix()},
    "SWAP": {"qiskit": {"g": qiskit.SwapGate}, "pyquil": {"g": pyquil.SWAP}, "matrix": qiskit.SwapGate().to_matrix()},
    # multi - parameterized 
    "ISWAP": {"qiskit": {"g": qiskit.iSwapGate}, "pyquil": {"g": pyquil.ISWAP}},  
    # quantastica uses crz, pytket uses cu1, they are not equal according to IBM unitarygate equ tho, cu1 == cphase, but crz != cphase, pennylane does not support CU1 at all
    # according to https://qiskit.org/documentation/stubs/qiskit.circuit.library.CU1Gate.html the relative phase of cu1 != cphase and therefore cphase is wrong in this context
    "CU1": {"qiskit": {"g": qiskit.CU1Gate}, "pyquil": {"g": pyquil.CPHASE}},  
    
    "CPHASE00": {"qiskit": {"r": cphase00_replacement}, "pyquil": {"g": pyquil.CPHASE00}}, 
    "CPHASE01": {"qiskit": {"r": cphase01_replacement}, "pyquil": {"g": pyquil.CPHASE01}}, 
    "CPHASE10": {"qiskit": {"r": cphase10_replacement}, "pyquil": {"g": pyquil.CPHASE10}},

    # TODO gates from https://qiskit.org/documentation/apidoc/circuit_library.html?highlight=circuit%20library
    "C3X": {"qiskit": {"g": qiskit.C3XGate}, "pyquil": {"r": c3x_replacement},"matrix": np.array([[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        if "g" in qiskit_dict:
            qiskit_gate = qiskit_dict["g"]
            gate_mapping_qiskit[qiskit_gate.__name__] = value 

    # dict contains g for a gate and r for a replacement circuit/program
    if pyquil_dict:
        if "g" in pyquil_dict:
            pyquil_gate = pyquil_dict["g"]
            gate_mapping_pyquil[pyquil_gate.__name__] = qiskit_dict 

