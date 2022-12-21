import qiskit.circuit.library.standard_gates as qiskit
import qiskit.circuit as directives
import pyquil.gates as pyquil
import braket.circuits.gates as braket
import numpy as np
from qiskit import QuantumCircuit
from pyquil import Program
from pyquil.quilatom import Parameter as pyquil_Parameter
import conversion.mappings.replacement_pyquil as pyquil_replacement
import conversion.mappings.replacement_qiskit as qiskit_replacement
import conversion.mappings.replacement_braket as braket_replacement

gate_mapping = {
    # single qubits
    "I": {"qiskit": {"g": qiskit.IGate}, "pyquil": {"g": pyquil.I}, "qsharp": {"g": "I"}, "braket": {"g": braket.I}, "matrix": qiskit.IGate().to_matrix()},
    "X": {"qiskit": {"g": qiskit.XGate}, "pyquil": {"g": pyquil.X}, "qsharp": {"g": "X"}, "braket": {"g": braket.X}, "matrix": qiskit.XGate().to_matrix()},
    "Y": {"qiskit": {"g": qiskit.YGate}, "pyquil": {"g": pyquil.Y}, "qsharp": {"g": "Y"}, "braket": {"g": braket.Y}, "matrix": qiskit.YGate().to_matrix()},
    "Z": {"qiskit": {"g": qiskit.ZGate}, "pyquil": {"g": pyquil.Z}, "qsharp": {"g": "Z"}, "braket": {"g": braket.Z}, "matrix": qiskit.ZGate().to_matrix()},
    "H": {"qiskit": {"g": qiskit.HGate}, "pyquil": {"g": pyquil.H}, "qsharp": {"g": "H"}, "braket": {"g": braket.H}, "matrix": qiskit.HGate().to_matrix()},
    "CH": {"qiskit": {"g": qiskit.CHGate}, "pyquil": {"n": "-"}, "qsharp": {"g": "CH"}, "braket": {"n": "-"}, "matrix": qiskit.CHGate().to_matrix()},
    "S": {"qiskit": {"g": qiskit.SGate}, "pyquil": {"g": pyquil.S}, "qsharp": {"g": "S"}, "braket": {"g": braket.S}, "matrix": qiskit.SGate().to_matrix()},
    "T": {"qiskit": {"g": qiskit.TGate}, "pyquil": {"g": pyquil.T}, "qsharp": {"g": "T"}, "braket": {"g": braket.T}, "matrix": qiskit.TGate().to_matrix()},
    # single - parameterized
    "RX": {"qiskit": {"g": qiskit.RXGate}, "pyquil": {"g": pyquil.RX}, "qsharp": {"g": "Rx"}, "braket": {"g": braket.Rx}},
    "CRX": {"qiskit": {"g": qiskit.CRXGate}, "pyquil": {"n": "-"}, "qsharp": {"g": "CRx"}, "braket": {"r": braket_replacement.crx_replacement}},
    "RY": {"qiskit": {"g": qiskit.RYGate}, "pyquil": {"g": pyquil.RY}, "qsharp": {"g": "Ry"}, "braket": {"g": braket.Ry}},
    "CRY": {"qiskit": {"g": qiskit.CRYGate}, "pyquil": {"n": "-"}, "qsharp": {"g": "CRy"}, "braket": {"r": braket_replacement.cry_replacement}},
    "RZ": {"qiskit": {"g": qiskit.RZGate}, "pyquil": {"g": pyquil.RZ}, "qsharp": {"g": "Rz"}, "braket": {"g": braket.Rz}},
    "CRZ": {"qiskit": {"g": qiskit.CRZGate}, "pyquil": {"n": "-"}, "qsharp": {"g": "CRz"}, "braket": {"r": braket_replacement.crz_replacement}},
    "U1": {"qiskit": {"g": qiskit.U1Gate}, "pyquil": {"g": pyquil.PHASE}, "qsharp": {"r": "-"}, "braket": {"g": braket.PhaseShift}},
    "U2": {"qiskit": {"g": qiskit.U2Gate}, "pyquil": {"r": pyquil_replacement.u2_replacement}, "qsharp": {"r": "-"}, "braket": {"r": braket_replacement.u2_replacement}},
    "U3": {"qiskit": {"g": qiskit.U3Gate}, "pyquil": {"r": pyquil_replacement.u3_replacement}, "qsharp": {"r": "-"}, "braket": {"r": braket_replacement.u3_replacement}},
    "Sdg": {"qiskit": {"g": qiskit.SdgGate}, "pyquil": {"r": pyquil_replacement.sdg_replacement}, "qsharp": {"r": "-"}, "braket": {"g": braket.Si}, "matrix": qiskit.SdgGate().to_matrix()},
    "Tdg": {"qiskit": {"g": qiskit.TdgGate}, "pyquil": {"r": pyquil_replacement.tdg_replacement}, "qsharp": {"r": "-"}, "braket": {"g": braket.Ti},  "matrix": qiskit.TdgGate().to_matrix()},
    # multi 
    "CX": {"qiskit": {"g": qiskit.CXGate}, "pyquil": {"g": pyquil.CNOT}, "qsharp": {"g": "CX"}, "braket": {"g": braket.CNot}, "matrix": qiskit.CXGate().to_matrix()},
    # CZ matrix not defined in qiskit
    "CZ": {"qiskit": {"g": qiskit.CZGate}, "pyquil": {"g": pyquil.CZ}, "qsharp": {"g": "CZ"}, "braket": {"g": braket.CZ}, "matrix": np.array([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,-1]
    ], dtype=complex)},
    "CCX": {"qiskit": {"g": qiskit.CCXGate}, "pyquil": {"g": pyquil.CCNOT}, "qsharp": {"g": "CCX"}, "braket": {"g": braket.CCNot}, "matrix": qiskit.CCXGate().to_matrix()},
    "SWAP": {"qiskit": {"g": qiskit.SwapGate}, "pyquil": {"g": pyquil.SWAP}, "qsharp": {"g": "SWAP"}, "braket": {"g": braket.Swap}, "matrix": qiskit.SwapGate().to_matrix()},
    # multi - parameterized 
    "ISWAP": {"qiskit": {"g": qiskit.iSwapGate}, "pyquil": {"g": pyquil.ISWAP}, "qsharp": {"r": "-"}, "braket": {"g": braket.ISwap}},
    "CU1": {"qiskit": {"g": qiskit.CU1Gate}, "pyquil": {"g": pyquil.CPHASE}, "qsharp": {"r": "-"}, "braket": {"g": braket.CPhaseShift}},
    "CPHASE00": {"qiskit": {"r": qiskit_replacement.cphase00_replacement}, "pyquil": {"g": pyquil.CPHASE00}, "qsharp": {"n": "-"}, "braket": {"g": braket.CPhaseShift00}},
    "CPHASE01": {"qiskit": {"r": qiskit_replacement.cphase01_replacement}, "pyquil": {"g": pyquil.CPHASE01}, "qsharp": {"n": "-"}, "braket": {"g": braket.CPhaseShift01}},
    "CPHASE10": {"qiskit": {"r": qiskit_replacement.cphase10_replacement}, "pyquil": {"g": pyquil.CPHASE10}, "qsharp": {"n": "-"}, "braket": {"g": braket.CPhaseShift10}},
    "PSWAP": {"qiskit": {"r": qiskit_replacement.pswap_replacement}, "pyquil": {"g": pyquil.PSWAP}, "qsharp": {"n": "-"}, "braket": {"g": braket.PSwap}},
    "MEASURE": {"qiskit": {"g": directives.Measure}, "pyquil": {"n": "-"}, "qsharp": {"g": "M"}, "braket": {"n": "-"}},
    "R1": {"qiskit": {"r": qiskit_replacement.r1_replacement}, "pyquil": {"n": "-"}, "qsharp": {"g": "R1"}, "braket": {"n": "-"}},
    "Reset": {"qiskit": {"g": directives.Reset}, "pyquil": {"g": pyquil.RESET}, "qsharp": {"g": "Reset"}, "braket": {"n": "-"}},

    # unnecessary with controlled modifier (for pyquil)
    # "CRX": {"qiskit": {"g": qiskit.CRXGate}, "pyquil": {"r": pyquil_replacement.crx_replacement}},
    # "C3X": {"qiskit": {"g": qiskit.C3XGate}, "pyquil": {"r": pyquil_replacement.c3x_replacement}},
    # "C4XGate": {"qiskit": qiskit.C3XGate, "pyquil": (), "matrix": []}    
}

gate_mapping_qiskit = {}
gate_mapping_pyquil = {}
gate_mapping_qsharp = {}
gate_mapping_braket = {}

for key, value in gate_mapping.items():
    qiskit_dict = value.get("qiskit")
    pyquil_dict = value.get("pyquil")
    qsharp_dict = value.get("qsharp")
    braket_dict = value.get("braket")

    
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

    if braket_dict:
        if "g" in braket_dict:
            braket_gate = braket_dict["g"]
            gate_mapping_braket[braket_gate.__name__] = qiskit_dict

