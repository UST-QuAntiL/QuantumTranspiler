from qiskit.circuit.library.standard_gates import *
import numpy as np
from qiskit.extensions import UnitaryGate
from qiskit import QuantumCircuit
from qiskit.circuit import Instruction


def cphase00_replacement(phi: float) -> QuantumCircuit:
    matrix = np.array([
        [np.e**(1j*phi), 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ], dtype=complex)

    gate = UnitaryGate(matrix, label="CPHASE00")
    return gate


def cphase01_replacement(phi: float) -> QuantumCircuit:
    matrix = np.array([
        [1, 0, 0, 0],
        [0, np.e**(1j*phi), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ], dtype=complex)

    gate = UnitaryGate(matrix, label="CPHASE01")
    return gate


def cphase10_replacement(phi: float) -> QuantumCircuit:
    matrix = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, np.e**(1j*phi), 0],
        [0, 0, 0, 1]
    ], dtype=complex)

    gate = UnitaryGate(matrix, label="CPHASE10")
    return gate


def pswap_replacement(phi: float) -> QuantumCircuit:
    matrix = np.array([
        [1, 0, 0, 0],
        [0, 0, np.e**(1j * phi), 0],
        [0, np.e**(1j * phi), 0, 0],
        [0, 0, 0, 1]
    ], dtype=complex)

    gate = UnitaryGate(matrix, label="PSWAP")
    return gate
