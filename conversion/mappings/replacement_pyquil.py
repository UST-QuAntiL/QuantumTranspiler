from pyquil.gates import *
import numpy as np
from pyquil import Program
from pyquil.quilbase import DefGate
from pyquil.quilatom import Parameter, quil_sin, quil_cos, quil_exp


def u2_replacement(phi: float, lam: float):
    """ implemented with a custom gate """
    # implemented with X90 pulse: https://qiskit.org/documentation/stubs/qiskit.circuit.library.U2Gate.html
    # p = Program()
    # p += RZ(phi + np.pi/2, 0)
    # p += RX(np.pi/2, 0)
    # p += RZ(lam - np.pi/2, 0)   

    phi_param = Parameter('phi')
    lam_param = Parameter('lam')
    matrix = np.array([
            [
                1 / np.sqrt(2),
                -quil_exp(1j * lam_param) * 1 / np.sqrt(2)
            ],
            [
                quil_exp(1j * phi_param) * 1 / np.sqrt(2),
                quil_exp(1j * (phi_param + lam_param)) * 1 / np.sqrt(2)
            ]
        ])
    definition = DefGate('U2', matrix, [phi_param, lam_param])    
    U2 = definition.get_constructor()
    p = Program()
    p += definition
    p += U2(phi, lam)(0)

    return p

def u3_replacement(theta: float, phi: float, lam: float):
    """ implemented with a custom gate """

    # implemented with two X90 pulse: https://arxiv.org/pdf/1707.03429.pdf 
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

    theta_param = Parameter('theta')
    phi_param = Parameter('phi')
    lam_param = Parameter('lam')
    matrix = np.array([
            [
                quil_cos(theta_param / 2),
                -quil_exp(1j * lam_param) * quil_sin(theta_param / 2)
            ],
            [
                quil_exp(1j * phi_param) * quil_sin(theta_param / 2),
                quil_exp(1j * (phi_param + lam_param)) * quil_cos(theta_param / 2)
            ]
        ])
    definition = DefGate('U3', matrix, [theta_param, phi_param, lam_param])    
    U3 = definition.get_constructor()
    p = Program()
    p += definition
    p += U3(theta, phi, lam)(0)

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