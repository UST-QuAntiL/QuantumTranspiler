import xacc

# Quil example, multiple kernels
xacc.qasm('''.compiler quil
.circuit ansatz
.parameters theta, phi
X 0
H 2
CNOT 2 1
CNOT 0 1
Rz(theta) 0
Ry(phi) 1
H 0
.circuit x0x1
ansatz(theta, phi)
H 0
H 1
MEASURE 0 [0]
MEASURE 1 [1]
''')
x0x1 = xacc.getCompiled('x0x1')