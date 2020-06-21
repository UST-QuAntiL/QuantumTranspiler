from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pyquil import Program, get_qc
from circuit.qiskit_utility import show_figure
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pyquil.gates import *
import numpy as np
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from qiskit.extensions import UnitaryGate
from qiskit.quantum_info.random import random_unitary
from pyquil.quilatom import Parameter, quil_sin, quil_cos
from qiskit.circuit import Qubit, Clbit
import qiskit.circuit as qiskit_circuit_library
import qiskit.circuit.library.standard_gates as qiskit_gates
from qiskit.quantum_info.operators import Operator


class ExampleCircuits:
    @staticmethod
    def qiskit_custom():
        qr = QuantumRegister(3, "q")
        qr2 = QuantumRegister(2, "qq")
        cr = ClassicalRegister(5)
        """multiple quantum register"""
        qiskit_circuit = QuantumCircuit(qr, qr2)
        # qiskit_circuit = QuantumCircuit(5)
        # qiskit_circuit.add_register(cr)

        """standard qiskit gate """
        # gate = qiskit_gates.CXGate()
        # qiskit_circuit.append(gate, qargs=[2,3])

        """standard qiskit gate with control """
        # gate = qiskit_gates.HGate().control(1)
        # qiskit_circuit.append(gate, qargs=[0,1])

        """standard qiskit gate with control #2"""
        # gate = qiskit_gates.RXGate(np.pi/2).control(2)
        # qiskit_circuit.append(gate, qargs=[3,2,1]) 

        """standard qiskit gate with control #3 """
        # gate = qiskit_gates.C3XGate()
        # qiskit_circuit.append(gate, qargs=[0,3,2,1])        

        """custom gate"""
        # custom_matrix1 = np.array([
        #     [np.e**(1j*np.pi/2), 0, 0, 0],
        #     [0, 1, 0, 0],
        #     [0, 0, 1, 0],
        #     [0, 0, 0, np.e**(1j*np.pi/2)]
        # ], dtype=complex)
        # # custom_matrix1 = random_unitary(4, seed=42)
        # custom_gate1 = UnitaryGate(custom_matrix1)
        # qiskit_circuit.append(custom_gate1, qargs=[0,1])

        """NOT possible: parameterized custom gate"""
        # theta = qiskit_circuit_library.Parameter("θ")
        # custom_matrix2 = np.array([
        #     [np.e**(1j*theta), 0, 0, 0],
        #     [0, 1, 0, 0],
        #     [0, 0, 1, 0],
        #     [0, 0, 0, np.e**(1j*theta)]
        # ])
        # custom_gate2 = UnitaryGate(custom_matrix2)
        # qiskit_circuit.append(custom_gate2, qargs=[0,1])

        """sub circuit"""
        # sub_q = QuantumRegister(2)
        # sub_circ = QuantumCircuit(2, 2)
        # sub_circ.cz(0, 1)
        # sub_circ.h(1)
        # sub_circ.h(0)
        # sub_circ.cx(0, 1)
        # sub_inst = sub_circ.to_instruction()
        # qiskit_circuit.append(sub_inst, [3, 4])

        """parameterized qiskit cirucit"""
        # theta = qiskit_circuit_library.Parameter("θ")
        # qiskit_circuit.rz(theta, 1)

        """qiskit gate that has no 1:1 standard gate in pyquil with parameter"""
        # phi = qiskit_circuit_library.Parameter("ϕ")
        # lambd = qiskit_circuit_library.Parameter("λ")
        # u2 = qiskit_gates.U2Gate(np.pi, lambd)
        # qiskit_circuit.append(u2, [1])

        """qiskit gate c3x"""        
        # c3xGate = qiskit_gates.C3XGate()
        # qiskit_circuit.append(c3xGate, qargs=[0, 1, 2, 3])

        """qiskit gate crx"""        
        # crxgate = qiskit_gates.CrxGate(np.pi)
        # qiskit_circuit.append(crxgate, qargs=[0, 1])

        """qiskit gate sdg"""        
        sdggate = qiskit_gates.TdgGate()
        qiskit_circuit.append(sdggate, qargs=[0])
        

        """measurement"""
        # qiskit_circuit.measure_all()

        show_figure(qiskit_circuit)
        return qiskit_circuit

    @staticmethod
    def pyquil_custom() -> Program:
        program = Program()
        # ro = program.declare('ro', 'BIT', 3)
        # ra = program.declare('ra', 'BIT', 2)


        """pyquil gates"""
        program += H(0)
        program += CNOT(0, 1)
        program += RX(np.pi, 2)
        program += CCNOT(0, 1, 2)
        program += H(3)
        program += X(1)

        """pyquil gate with no 1:1 qiskit gate"""
        # program += CPHASE00(np.pi, 1, 0)

        """pyquil gate with no 1:1 qiskit gate #2"""
        # program += PSWAP(np.pi, 1, 0)

        """modifier"""
        # gate = RX(np.pi/4, 1).dagger().controlled(0)
        # program += gate

        """custom gate"""
        # sqrt_x = np.array([[0.5+0.5j,  0.5-0.5j],
        #                    [0.5-0.5j,  0.5+0.5j]])
        # sqrt_x_definition = DefGate("SQRT-X", sqrt_x)
        # SQRT_X = sqrt_x_definition.get_constructor()
        # program += sqrt_x_definition
        # program += SQRT_X(0)

        """NOT working: parameterized custom gate"""
        # theta = Parameter('theta')
        # crx = np.array([
        #     [1, 0, 0, 0],
        #     [0, 1, 0, 0],
        #     [0, 0, quil_cos(theta / 2), -1j * quil_sin(theta / 2)],
        #     [0, 0, -1j * quil_sin(theta / 2), quil_cos(theta / 2)]
        # ])
        # gate_definition = DefGate('CRX', crx, [theta])
        # CRX = gate_definition.get_constructor()
        # program += gate_definition
        # program += CRX(np.pi/2)(0, 1)

        """parameterized pyquil circuit"""
        theta = Parameter("θ")
        program += RY(theta, 0)

        """meausrements"""
        # program += MEASURE(0, ro[0])
        # program += MEASURE(0, ra[1])
        # program += MEASURE(1, ra[0])

        return program

    @staticmethod
    def qiskit_shor() -> QuantumCircuit:
        return QuantumCircuit.from_qasm_str(ExampleCircuits.qasm_shor())

    @staticmethod
    def qasm_shor() -> str:
        with open("examples/circuit_shor.qasm", "r") as f:
            return f.read()

    @staticmethod
    def quil_shor() -> str:
        with open("examples/circuit_shor.quil", "r") as f:
            return f.read()

    @staticmethod
    def pyquil_shor() -> str:
        return Program(ExampleCircuits.quil_shor())
