import braket.circuits.gates as braket_gates
import braket
import numpy as np
from braket.circuits import Circuit, Instruction, FreeParameter
import qiskit.circuit.library.standard_gates as qiskit


def u2_replacement(phi: float, lam: float):
    """ implemented with a custom gate """
    if isinstance(phi, FreeParameter) or isinstance(lam, FreeParameter):
        raise ValueError("Parameters are not supported for replaced gates")
    matrix = np.array([
        [
            1 / np.sqrt(2),
            -np.exp(1j * lam) * 1 / np.sqrt(2)
        ],
        [
            np.exp(1j * phi) * 1 / np.sqrt(2),
            np.exp(1j * (phi + lam)) * 1 / np.sqrt(2)
        ]
    ])
    gate = braket_gates.Unitary(matrix=matrix, display_name="U2")
    instruction = Instruction(gate, 0)
    return instruction


def u3_replacement(theta: float, phi: float, lam: float):
    """ implemented with a custom gate """
    if isinstance(theta, FreeParameter) or isinstance(phi, FreeParameter) or isinstance(lam, FreeParameter):
        raise ValueError("Parameters are not supported for replaced gates")
    matrix = np.array([
        [
            np.cos(theta / 2),
            -np.exp(1j * lam) * np.sin(theta / 2)
        ],
        [
            np.exp(1j * phi) * np.sin(theta / 2),
            np.exp(1j * (phi + lam)) *
            np.cos(theta / 2)
        ]
    ])
    gate = braket_gates.Unitary(matrix=matrix, display_name="U3")
    instruction = Instruction(gate, 0)
    return instruction


def crx_replacement(theta: float):
    """ implemented with a custom gate, matrix obtained from Qiskit """
    if isinstance(theta, FreeParameter):
        raise ValueError("Parameters are not supported for replaced gates")
    matrix = np.array([[1, 0, 0, 0],
                      [0, 1, 0, 0],
                      [0, 0, np.cos(theta/2), -1j*np.sin(theta/2)],
                      [0, 0, -1j*np.sin(theta/2), np.cos(theta/2)]])
    gate = braket_gates.Unitary(matrix=matrix, display_name="CRX")
    instruction = Instruction(gate, [0, 1])
    return instruction


def cry_replacement(theta: float):
    """ implemented with a custom gate, matrix obtained from Qiskit """
    if isinstance(theta, FreeParameter):
        raise ValueError("Parameters are not supported for replaced gates")
    matrix = np.array([[1, 0, 0, 0],
                       [0, 1, 0, 0],
                       [0, 0, np.cos(theta / 2), -1*np.sin(theta / 2)],
                       [0, 0, np.sin(theta / 2), np.cos(theta / 2)]])
    gate = braket_gates.Unitary(matrix=matrix, display_name="CRY")
    instruction = Instruction(gate, [0, 1])
    return instruction


def crz_replacement(theta: float):
    """ implemented with a custom gate, matrix obtained from Qiskit """
    if isinstance(theta, FreeParameter):
        raise ValueError("Parameters are not supported for replaced gates")
    matrix = np.array([[1, 0, 0, 0],
                       [0, 1, 0, 0],
                       [0, 0, np.exp(-1j * (theta / 2)), 0],
                       [0, 0, 0, np.exp(1j * (theta / 2))]])
    gate = braket_gates.Unitary(matrix=matrix, display_name="CRZ")
    instruction = Instruction(gate, [0, 1])
    return instruction

