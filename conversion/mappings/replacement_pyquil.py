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

# TODO formula wrong
def u3_replacement(theta, phi, lam):
    """implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html"""
    p = Program()
    p += RZ(phi + np.pi/2, 0)
    p += RX(np.pi/2, 0)
    p += RZ(lam - np.pi/2, 0)
    return p