import qiskit

QISKIT_EXAMPLE = """qc = QuantumCircuit(2,2)
qc.h(0)
qc.h(1)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)"""

QASM_EXAMPLE = """OPENQASM 2.0;
            include "qelib1.inc";
            qreg q[2];
            creg c[2];
            h q[0];
            h q[1];
            cx q[0],q[1];
            measure q[0] -> c[0];
            measure q[1] -> c[1];"""