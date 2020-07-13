from pyquil.gates import *
import numpy as np
from pyquil import Program
from pyquil.quilatom import Parameter
from pyquil.quilbase import DefGate


def u2_replacement(phi: float, lam: float):
    """ implemented with a custom gate 
    # implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html"""
    # p = Program()
    # p += RZ(phi + np.pi/2, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(lam - np.pi/2, 0)

    matrix = np.array([
            [
                1 / np.sqrt(2),
                -np.exp(1j * lam) * 1 / np.sqrt(2)
            ],
            [
                np.exp(1j * phi) * 1 / np.sqrt(2),
                np.exp(1j * (phi + lam)) * 1 / np.sqrt(2)
            ]
        ], dtype=complex)

    param_str = str(phi) + str(lam)
    param_hash = hash(param_str)
    # unique name for each U3 with different params
    definition = DefGate("U2" + str(param_hash), matrix)
    U2 = definition.get_constructor()
    p = Program()
    p += definition
    p += U2(0)
    return p

def u3_replacement(theta: float, phi: float, lam: float):
    """ implemented with a custom gate 

    # implemented with two X90 pulse: https://arxiv.org/pdf/1707.03429.pdf """
    # p = Program()
    # p += RZ(phi + 3*np.pi, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(np.pi + theta, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(lam, 0)
    # formula from https://qiskit.org/documentation/stubs/qiskit.circuit.library.U3Gate.html (13.07.2020) gives wrong results 
    # p = Program()
    # p += RZ(phi - np.pi/2, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(np.pi - theta, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(lam - np.pi/2, 0)

    matrix = np.array([
            [
                np.cos(theta / 2),
                -np.exp(1j * lam) * np.sin(theta / 2)
            ],
            [
                np.exp(1j * phi) * np.sin(theta / 2),
                np.exp(1j * (phi + lam)) * np.cos(theta / 2)
            ]
        ], dtype=complex)

    param_str = str(theta) + str(phi) + str(lam)
    param_hash = hash(param_str)
    # unique name for each U3 with different params
    definition = DefGate("U3" + str(param_hash), matrix)
    U3 = definition.get_constructor()
    p = Program()
    p += definition
    p += U3(0)
    return p

def c3x_replacement():
    p = Program()
    p += CCNOT(1,2,3).controlled(0)
    return p 

def sdg_replacement():
    p = Program()
    p += RZ(-np.pi/2, 0)
    return p

def tdg_replacement():
    p = Program()
    p += RZ(-np.pi/4, 0)
    return p