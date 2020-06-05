from pyquil.gates import *
import numpy as np
from pyquil import Program
from pyquil.quilatom import Parameter


def u2_replacement(phi, lam, qubit):
    """implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html"""
    p = Program()
    p += RZ(phi + np.pi/2, qubit)
    p += RX(np.pi/2, qubit)
    p += RZ(lam - np.pi/2, qubit)
    return p

# TODO formula wrong
def u3_replacement(theta, phi, lam, qubit):
    """implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html"""
    p = Program()
    p += RZ(phi + np.pi/2, qubit)
    p += RX(np.pi/2, qubit)
    p += RZ(lam - np.pi/2, qubit)
    return p