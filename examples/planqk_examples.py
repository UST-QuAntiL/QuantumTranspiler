from qiskit import QuantumRegister, ClassicalRegister
from qiskit import QuantumCircuit
"""algorithms from PlanQK/planqk-atlas-content/example-data/example-implementations"""

def shor_15() -> QuantumCircuit:
    qc = QuantumCircuit()

    q = QuantumRegister(5, 'q')
    c = ClassicalRegister(3, 'c')

    qc.add_register(q)
    qc.add_register(c)

    qc.h(q[0])
    qc.h(q[1])
    qc.h(q[2])
    qc.h(q[1])
    qc.cx(q[2], q[3])
    qc.cu1(0, q[1], q[0])
    qc.cx(q[2], q[4])
    qc.h(q[0])
    qc.cu1(0, q[1], q[2])
    qc.cu1(0, q[0], q[2])
    qc.h(q[2])
    qc.measure(q[0], c[0])
    qc.measure(q[1], c[1])
    qc.measure(q[2], c[2])

    return qc

def shor_general(n: int) -> QuantumCircuit:
    from qiskit.aqua.algorithms.factorizers import Shor

    shor = Shor(n)
    shor_circuit = shor.construct_circuit(measurement=True)
    return shor_circuit

def grover_general_truthtable_qiskit(oracle_string: str) -> QuantumCircuit:      
    from qiskit.aqua.algorithms import Grover
    from qiskit.aqua.components.oracles import TruthTableOracle

    # input is binary String of a truth table, like '1000': A & B = 0 => f(x*) = 1
    oracle = TruthTableOracle(oracle_string)
    grover = Grover(oracle)
    grover_circuit = grover.construct_circuit(measurement=True)
    return grover_circuit

def grover_general_logicalexpression_qiskit(oracle_string: str) -> QuantumCircuit:   
    from qiskit.aqua.algorithms import Grover
    from qiskit.aqua.components.oracles import LogicalExpressionOracle   

    # input is logical expression, like '(A | B) & (A | ~B) & (~A | B)'
    oracle = LogicalExpressionOracle(oracle_string)
    grover = Grover(oracle)
    grover_circuit = grover.construct_circuit(measurement=True)
    return grover_circuit

def grover_fix_qiskit() -> QuantumCircuit:   
    qc = QuantumCircuit()

    q = QuantumRegister(4, 'q')
    ro = ClassicalRegister(4, 'ro')

    qc.add_register(q)
    qc.add_register(ro)

    qc.h(q[0])
    qc.h(q[1])
    qc.h(q[2])
    qc.h(q[3])
    qc.x(q[0])
    qc.x(q[2])
    qc.x(q[3])
    qc.crz(0.785398163397, q[0], q[3])
    qc.cx(q[0], q[1])
    qc.crz(-0.785398163397, q[1], q[3])
    qc.cx(q[0], q[1])
    qc.crz(0.785398163397, q[1], q[3])
    qc.cx(q[1], q[2])
    qc.crz(-0.785398163397, q[2], q[3])
    qc.cx(q[0], q[2])
    qc.crz(0.785398163397, q[2], q[3])
    qc.cx(q[1], q[2])
    qc.crz(-0.785398163397, q[2], q[3])
    qc.cx(q[0], q[2])
    qc.crz(0.785398163397, q[2], q[3])
    qc.x(q[0])
    qc.x(q[2])
    qc.x(q[3])
    qc.h(q[0])
    qc.h(q[1])
    qc.h(q[2])
    qc.h(q[3])
    qc.x(q[0])
    qc.x(q[1])
    qc.x(q[2])
    qc.x(q[3])
    qc.crz(0.785398163397, q[0], q[3])
    qc.cx(q[0], q[1])
    qc.crz(-0.785398163397, q[1], q[3])
    qc.cx(q[0], q[1])
    qc.crz(0.785398163397, q[1], q[3])
    qc.cx(q[1], q[2])
    qc.crz(-0.785398163397, q[2], q[3])
    qc.cx(q[0], q[2])
    qc.crz(0.785398163397, q[2], q[3])
    qc.cx(q[1], q[2])
    qc.crz(-0.785398163397, q[2], q[3])
    qc.cx(q[0], q[2])
    qc.crz(0.785398163397, q[2], q[3])
    qc.x(q[0])
    qc.x(q[1])
    qc.x(q[2])
    qc.x(q[3])
    qc.h(q[0])
    qc.h(q[1])
    qc.h(q[2])
    qc.h(q[3])
    qc.measure(q[0], ro[0])
    qc.measure(q[1], ro[1])
    qc.measure(q[2], ro[2])
    qc.measure(q[3], ro[3])
    return qc


def grover_fix_SAT_qiskit() -> QuantumCircuit:   
    qc = QuantumCircuit()

    q = QuantumRegister(8, 'q')
    c = ClassicalRegister(2, 'c')

    qc.add_register(q)
    qc.add_register(c)

    qc.h(q[0])
    qc.h(q[1])
    qc.x(q[2])
    qc.x(q[3])
    qc.x(q[4])
    qc.x(q[7])
    qc.x(q[0])
    qc.x(q[1])
    qc.h(q[7])
    qc.ccx(q[0], q[1], q[2])
    qc.x(q[0])
    qc.x(q[1])
    qc.x(q[1])
    qc.ccx(q[0], q[1], q[3])
    qc.x(q[0])
    qc.x(q[1])
    qc.ccx(q[1], q[0], q[4])
    qc.x(q[0])
    qc.ccx(q[3], q[2], q[5])
    qc.x(q[0])
    qc.ccx(q[5], q[4], q[6])
    qc.cx(q[6], q[7])
    qc.ccx(q[4], q[5], q[6])
    qc.ccx(q[2], q[3], q[5])
    qc.x(q[4])
    qc.ccx(q[0], q[1], q[4])
    qc.x(q[0])
    qc.x(q[1])
    qc.x(q[3])
    qc.ccx(q[0], q[1], q[3])
    qc.x(q[0])
    qc.x(q[1])
    qc.x(q[2])
    qc.x(q[1])
    qc.ccx(q[0], q[1], q[2])
    qc.x(q[0])
    qc.x(q[1])
    qc.h(q[0])
    qc.h(q[1])
    qc.x(q[0])
    qc.x(q[1])
    qc.cz(q[0], q[1])
    qc.x(q[0])
    qc.x(q[1])
    qc.h(q[0])
    qc.h(q[1])
    qc.measure(q[0], c[0])
    qc.measure(q[1], c[1])
    return qc

def bernstein_vazirani_general_qiskit_integer(number_of_qubits: int, a: int, use_iden: bool = True) -> QuantumCircuit:   
    a = a % 2**(number_of_qubits) # a = a mod 2^(number_of_qubits)

    qr = QuantumRegister(number_of_qubits)
    cr = ClassicalRegister(number_of_qubits)

    qc = QuantumCircuit(qr, cr)

    # hadamard gates
    for i in range(number_of_qubits):
        qc.h(qr[i])

    qc.barrier()

    # inner product oracle
    for i in range(number_of_qubits):
        if (a & (1 << i)):  #if bin(a)[i] = 1 then use Z gate
            qc.z(qr[i])
        else:
            if use_iden:
                qc.i(qr[i])  # else (=0) use identity

    qc.barrier()

    # hadamard gates
    for i in range(number_of_qubits):
        qc.h(qr[i])

    # measurement
    qc.barrier(qr)
    qc.measure(qr, cr)
    return qc

def bernstein_vazirani_general_qiskit_binary_string(number_of_qubits: int, s: str) -> QuantumCircuit: 
    n = number_of_qubits  
    # We need a circuit with n qubits, plus one ancilla qubit
    # Also need n classical bits to write the output to
    bv_circuit = QuantumCircuit(n + 1, n)

    # put ancilla in state |->
    bv_circuit.h(n)
    bv_circuit.z(n)

    # Apply Hadamard gates before querying the oracle
    for i in range(n):
        bv_circuit.h(i)

    # Apply barrier
    bv_circuit.barrier()

    # Apply the inner-product oracle
    s = s[::-1]  # reverse s to fit qiskit's qubit ordering
    for q in range(n):
        if s[q] == '0':
            bv_circuit.i(q)
        else:
            bv_circuit.cx(q, n)

    # Apply barrier
    bv_circuit.barrier()

    # Apply Hadamard gates after querying the oracle
    for i in range(n):
        bv_circuit.h(i)

    # Measurement
    for i in range(n):
        bv_circuit.measure(i, i)

    return bv_circuit