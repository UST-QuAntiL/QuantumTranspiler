from pyquil.gates import *
import numpy as np
from pyquil import Program
from pyquil.quilatom import Parameter


def u2_replacement(phi, lam):
    """implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html"""
    p = Program()
    p += RZ(phi + np.pi/2, 0)
    p += RX(np.pi/2, 0)
    p += RZ(lam - np.pi/2, 0)
    return p

def u3_replacement(theta, phi, lam):
    """implemented with two X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U3Gate.html"""
    p = Program()
    p += RZ(phi - np.pi/2, 0)
    p += RX(np.pi/2, 0)
    p += RZ(np.pi - theta, 0)
    p += RX(np.pi/2, 0)
    p += RZ(lam - np.pi/2, 0)
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