from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
from qiskit.converters import circuit_to_dag, dag_to_circuit
from qiskit import extensions as ex

QISKIT_OPERATION_MAP = {
    # native PennyLane operations also native to qiskit
    "PauliX": ex.XGate,
    "PauliY": ex.YGate,
    "PauliZ": ex.ZGate,
    "Hadamard": ex.HGate,
    "CNOT": ex.CXGate,
    "CZ": ex.CZGate,
    "SWAP": ex.SwapGate,
    "RX": ex.RXGate,
    "RY": ex.RYGate,
    "RZ": ex.RZGate,
    "S": ex.SGate,
    "T": ex.TGate,
    # Adding the following for conversion compatibility
    "CSWAP": ex.CSwapGate,
    "CRX": ex.CRXGate,
    "CRY": ex.CRYGate,
    "CRZ": ex.CRZGate,
    "PhaseShift": ex.U1Gate,
    "QubitStateVector": ex.Initialize,
    "U2": ex.U2Gate,
    "U3": ex.U3Gate,
    "Toffoli": ex.CCXGate,
    "QubitUnitary": ex.UnitaryGate,
}
QISKIT_OPERATION_INVERSES_MAP = {k + ".inv": v for k, v in QISKIT_OPERATION_MAP.items()}


class QASMDevice:
    """ 
        Implements some of the methods of the Pennylane QiskitDevice to transform a Pennylane DAG to a Qiskit QuantumCircuit
    """
    _operation_map = {**QISKIT_OPERATION_MAP, **QISKIT_OPERATION_INVERSES_MAP}

    def __init__(self, num_wires):
        self.num_wires = num_wires
        self._reg = QuantumRegister(self.num_wires, "q")
        self._creg = ClassicalRegister(self.num_wires, "c")
        self._circuit = QuantumCircuit(self._reg, self._creg, name="temp")

    def apply(self, operations, **kwargs):
        rotations = kwargs.get("rotations", [])

        applied_operations = self.apply_operations(operations)

        # Rotating the state for measurement in the computational basis
        rotation_circuits = self.apply_operations(rotations)
        applied_operations.extend(rotation_circuits)

        for circuit in applied_operations:
            self._circuit += circuit

        # if self.backend_name not in self._state_backends:
        #     # Add measurements if they are needed
        #     for qr, cr in zip(self._reg, self._creg):
        #         measure(self._circuit, qr, cr)

        # These operations need to run for all devices
        # qobj = self.compile()
        # self.run(qobj)

    def apply_operations(self, operations):
        """Apply the circuit operations.

        This method serves as an auxiliary method to :meth:`~.QiskitDevice.apply`.

        Args:
            operations (List[pennylane.Operation]): operations to be applied

        Returns:
            list[QuantumCircuit]: a list of quantum circuit objects that
                specify the corresponding operations
        """
        circuits = []

        for operation in operations:
            # Apply the circuit operations
            wires = operation.wires
            par = operation.parameters
            operation = operation.name

            mapped_operation = self._operation_map[operation]

            self.qubit_unitary_check(operation, par, wires)
            self.qubit_state_vector_check(operation, par, wires)

            qregs = [self._reg[i] for i in wires]

            if operation in ("QubitUnitary", "QubitStateVector"):
                # Need to revert the order of the quantum registers used in
                # Qiskit such that it matches the PennyLane ordering
                qregs = list(reversed(qregs))

            dag = circuit_to_dag(QuantumCircuit(self._reg, self._creg, name=""))
            gate = mapped_operation(*par)

            if operation.endswith(".inv"):
                gate = gate.inverse()

            dag.apply_operation_back(gate, qargs=qregs)
            circuit = dag_to_circuit(dag)
            circuits.append(circuit)

        return circuits
    
    @staticmethod
    def qubit_unitary_check(operation, par, wires):
        """Input check for the the QubitUnitary operation."""
        if operation == "QubitUnitary":
            if len(par[0]) != 2 ** len(wires):
                raise ValueError(
                    "Unitary matrix must be of shape (2**wires,\
                        2**wires)."
                )

    def qubit_state_vector_check(self, operation, par, wires):
        """Input check for the the QubitStateVector operation."""
        if operation == "QubitStateVector":

            if len(par[0]) != 2 ** len(wires):
                raise ValueError("State vector must be of length 2**wires.")