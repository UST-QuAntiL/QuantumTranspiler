import qiskit.circuit.library.standard_gates as qiskit
import qiskit.circuit as directives
import pyquil.gates as pyquil
import numpy as np
from qiskit import QuantumCircuit
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
import conversion.mappings.replacement_pyquil as pyquil_replacement
import conversion.mappings.replacement_qiskit as qiskit_replacement

gate_mapping = {
    # single qubits
    "I": {"qiskit": {"g": qiskit.IGate}, "pyquil": {"g": pyquil.I}, "qsharp": {"g": "I"}, "matrix": qiskit.IGate().to_matrix()},
    "X": {"qiskit": {"g": qiskit.XGate}, "pyquil": {"g": pyquil.X}, "qsharp": {"g": "X"}, "matrix": qiskit.XGate().to_matrix()},
    "Y": {"qiskit": {"g": qiskit.YGate}, "pyquil": {"g": pyquil.Y}, "qsharp": {"g": "Y"}, "matrix": qiskit.YGate().to_matrix()},
    "Z": {"qiskit": {"g": qiskit.ZGate}, "pyquil": {"g": pyquil.Z}, "qsharp": {"g": "Z"}, "matrix": qiskit.ZGate().to_matrix()},
    "H": {"qiskit": {"g": qiskit.HGate}, "pyquil": {"g": pyquil.H}, "qsharp": {"g": "H"}, "matrix": qiskit.HGate().to_matrix()},
    "S": {"qiskit": {"g": qiskit.SGate}, "pyquil": {"g": pyquil.S}, "qsharp": {"g": "S"}, "matrix": qiskit.SGate().to_matrix()},
    "T": {"qiskit": {"g": qiskit.TGate}, "pyquil": {"g": pyquil.T}, "qsharp": {"g": "T"}, "matrix": qiskit.TGate().to_matrix()},
    # single - parameterized
    "RX": {"qiskit": {"g": qiskit.RXGate}, "pyquil": {"g": pyquil.RX}, "qsharp": {"g": "Rx"}},
    "RY": {"qiskit": {"g": qiskit.RYGate}, "pyquil": {"g": pyquil.RY}, "qsharp": {"g": "Ry"}},
    "RZ": {"qiskit": {"g": qiskit.RZGate}, "pyquil": {"g": pyquil.RZ}, "qsharp": {"g": "Rz"}},
    "U1": {"qiskit": {"g": qiskit.U1Gate}, "pyquil": {"g": pyquil.PHASE}, "qsharp": {"r": "-"}},
    "U2": {"qiskit": {"g": qiskit.U2Gate}, "pyquil": {"r": pyquil_replacement.u2_replacement}, "qsharp": {"r": "-"}},
    "U3": {"qiskit": {"g": qiskit.U3Gate}, "pyquil": {"r": pyquil_replacement.u3_replacement}, "qsharp": {"r": "-"}},
    "Sdg": {"qiskit": {"g": qiskit.SdgGate}, "pyquil": {"r": pyquil_replacement.sdg_replacement}, "qsharp": {"r": "-"}, "matrix": qiskit.SdgGate().to_matrix()},
    "Tdg": {"qiskit": {"g": qiskit.TdgGate}, "pyquil": {"r": pyquil_replacement.tdg_replacement}, "qsharp": {"r": "-"}, "matrix": qiskit.TdgGate().to_matrix()},
    # multi 
    "CX": {"qiskit": {"g": qiskit.CXGate}, "pyquil": {"g": pyquil.CNOT}, "qsharp": {"g": "CX"}, "matrix": qiskit.CXGate().to_matrix()},
    # CZ matrix not defined in qiskit
    "CZ": {"qiskit": {"g": qiskit.CZGate}, "pyquil": {"g": pyquil.CZ}, "qsharp": {"g": "CZ"}, "matrix": np.array([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,-1]
    ], dtype=complex)},
    "CCX": {"qiskit": {"g": qiskit.CCXGate}, "pyquil": {"g": pyquil.CCNOT}, "qsharp": {"g": "CCX"}, "matrix": qiskit.CCXGate().to_matrix()},
    "SWAP": {"qiskit": {"g": qiskit.SwapGate}, "pyquil": {"g": pyquil.SWAP}, "qsharp": {"g": "SWAP"}, "matrix": qiskit.SwapGate().to_matrix()},
    # multi - parameterized 
    "ISWAP": {"qiskit": {"g": qiskit.iSwapGate}, "pyquil": {"g": pyquil.ISWAP}, "qsharp": {"r": "-"}},
    "CU1": {"qiskit": {"g": qiskit.CU1Gate}, "pyquil": {"g": pyquil.CPHASE}, "qsharp": {"r": "-"}},
    "CPHASE00": {"qiskit": {"r": qiskit_replacement.cphase00_replacement}, "pyquil": {"g": pyquil.CPHASE00}, "qsharp": {"r": "-"}},
    "CPHASE01": {"qiskit": {"r": qiskit_replacement.cphase01_replacement}, "pyquil": {"g": pyquil.CPHASE01}, "qsharp": {"r": "-"}},
    "CPHASE10": {"qiskit": {"r": qiskit_replacement.cphase10_replacement}, "pyquil": {"g": pyquil.CPHASE10}, "qsharp": {"r": "-"}},
    "PSWAP": {"qiskit": {"r": qiskit_replacement.pswap_replacement}, "pyquil": {"g": pyquil.PSWAP}, "qsharp": {"r": "-"}},
    "MEASURE": {"qiskit": {"g": directives.Measure}, "pyquil": {"r": "-"}, "qsharp": {"g": "M"}},
    
    # unnecessary with controlled modifier (for pyquil)
    # "CRX": {"qiskit": {"g": qiskit.CRXGate}, "pyquil": {"r": pyquil_replacement.crx_replacement}},
    # "C3X": {"qiskit": {"g": qiskit.C3XGate}, "pyquil": {"r": pyquil_replacement.c3x_replacement}},
    # "C4XGate": {"qiskit": qiskit.C3XGate, "pyquil": (), "matrix": []}    
}

gate_mapping_qiskit = {}
gate_mapping_pyquil = {}
gate_mapping_qsharp = {}

for key, value in gate_mapping.items():
    qiskit_dict = value["qiskit"]
    pyquil_dict = value["pyquil"]
    qsharp_dict = value["qsharp"]

    
    if qiskit_dict:
        if "g" in qiskit_dict:
            qiskit_gate = qiskit_dict["g"]
            gate_mapping_qiskit[qiskit_gate.__name__] = value 

    # dict contains g for a gate and r for a replacement circuit/program
    if pyquil_dict:
        if "g" in pyquil_dict:
            pyquil_gate = pyquil_dict["g"]
            gate_mapping_pyquil[pyquil_gate.__name__] = qiskit_dict


    if qsharp_dict:
        if "g" in qsharp_dict:
            qsharp_gate = qsharp_dict["g"]
            gate_mapping_qsharp[qsharp_gate] = qiskit_dict

