class CZGate(ControlledGate, metaclass=CZMeta):
    r"""Controlled-Z gate.

    This is a Clifford and symmetric gate.

    **Circuit symbol:**

    .. parsed-literal::

        q_0: ─■─
              │
        q_1: ─■─

    **Matrix representation:**

    .. math::

        CZ\ q_1, q_0 =
            |0\rangle\langle 0| \otimes I + |1\rangle\langle 1| \otimes Z =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & 1 & 0 \\
                0 & 0 & 0 & -1
            \end{pmatrix}

    In the computational basis, this gate flips the phase of
    the target qubit if the control qubit is in the :math:`|1\rangle` state.
    """

    def __init__(self, label=None, ctrl_state=None):
        """Create new CZ gate."""
        super().__init__('cz', 2, [], label=label, num_ctrl_qubits=1,
                         ctrl_state=ctrl_state)
        self.base_gate = ZGate()

    def _define(self):
        """
        gate cz a,b { h b; cx a,b; h b; }
        """
        from .h import HGate
        from .x import CXGate
        definition = []
        q = QuantumRegister(2, 'q')
        rule = [
            (HGate(), [q[1]], []),
            (CXGate(), [q[0], q[1]], []),
            (HGate(), [q[1]], [])
        ]
        for inst in rule:
            definition.append(inst)
        self.definition = definition

    def inverse(self):
        """Return inverted CZ gate (itself)."""
        return CZGate()  # self-inverse

    def to_matrix(self):
        """Return a numpy.array for the CZ gate."""
        return numpy.array([[1, 0, 0, 0],
                            [0, 1, 0, 0],
                            [0, 0, 1, 0],
                            [0, 0, 0, -1]], dtype=complex)