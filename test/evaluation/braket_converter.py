import numpy as np
from typing import Tuple, Dict, List
from qiskit.circuit import Qubit, Clbit
from conversion.converter.converter_interface import ConverterInterface
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
from qiskit import QuantumCircuit, transpile, ClassicalRegister
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qiskit import tk_to_qiskit
from pytket.extensions.braket import tk_to_braket
from pytket.extensions.braket import braket_to_tk
from braket.ir.jaqcd import Program
from braket.circuits.circuit import Circuit
from braket.circuits import Observable


class BraketConverter(ConverterInterface):
    name = "braket"
    is_control_capable = True
    has_internal_export = True
    BRAKET_GATES = ["barrier", "c3x", "c4x", "ccx", "dcx", "h", "crx", "cry", "cswap", "cx", "cy", "cz",
                    "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "sdg", "t", "tdg", "x",
                    "y", "z", "measure"]

    def import_circuit(self, circuit) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        self.program = circuit
        qcircuit: QuantumCircuit = tk_to_qiskit(braket_to_tk(circuit))
        qreg_mapping = {}
        for counter, qubit in enumerate(qcircuit.qubits):
            qreg_mapping[counter] = qubit
        creg_mapping = {}
        for counter, clbit in enumerate(qcircuit.clbits):
            creg_mapping[str(counter)] = clbit
        return qcircuit, qreg_mapping, creg_mapping

    def export_circuit(self, qcircuit: QuantumCircuit):
        # Compile circuit to gate set supported by pytket and Braket
        qcircuit = transpile(qcircuit, basis_gates=self.BRAKET_GATES)
        circuit: Circuit = tk_to_braket(qiskit_to_tk(qcircuit))
        return circuit

    @property
    def circuit(self):
        return self.program

    def init_circuit(self):
        self.program = Circuit()

    def create_qreg_mapping(self, qreg_mapping, qubit: Qubit, index: int):
        raise NotImplementedError()

    def create_creg_mapping(self, cregs: List[ClassicalRegister]):
        raise NotImplementedError()

    def gate(self, is_controlled=False):
        raise NotImplementedError()

    def custom_gate(self):
        raise NotImplementedError()

    def parameter_conversion(self, parameter: qiskit_Parameter):
        raise NotImplementedError()

    def parameter_expression_conversion(self, parameter: qiskit_Parameter_expression):
        raise NotImplementedError()

    def barrier(self, qubits):
        raise NotImplementedError()

    def measure(self):
        raise NotImplementedError()

    def subcircuit(self, subcircuit, qubits, clbits):
        raise NotImplementedError()

    def language_to_circuit(self, language: str):
        ir = Program.parse_raw(language)
        instructions = ir.instructions
        circuit = Circuit()
        # adding of instructions
        for inst in instructions:
            # Get instruction by name. This is possible since braket and braket ir use identical names for all gates.
            instcall = getattr(circuit, f"{inst.type}")
            args = []
            kwargs = {}
            # Special cases for gates that interact with matrices, since they have special target syntax
            if hasattr(inst, "matrices"):
                matrices = inst.matrices.copy()
                reformed_matrices = []
                for matrix in matrices:
                    for row in matrix:
                        for i in range(len(row)):
                            row[i] = np.complex(row[i][0], row[i][1])
                    reformed_matrices.append(np.array(matrix))
                args.append(inst.targets)
                kwargs["matrices"] = reformed_matrices
            elif hasattr(inst, "matrix"):
                matrix = inst.matrix.copy()
                for row in matrix:
                    for i in range(len(row)):
                        row[i] = np.complex(row[i][0], row[i][1])
                kwargs["matrix"] = np.array(matrix)
                kwargs["targets"] = inst.targets
            else:
                # Adding of parameters to args and kwargs respectively
                if hasattr(inst, "control"):
                    args.append(inst.control)
                elif hasattr(inst, "controls"):
                    for control in inst.controls:
                        args.append(control)

                if hasattr(inst, "target"):
                    args.append(inst.target)
                elif hasattr(inst, "targets"):
                    for target in inst.targets:
                        args.append(target)

                if hasattr(inst, "angle"):
                    args.append(inst.angle)

                if hasattr(inst, "probability"):
                    kwargs["probability"] = inst.probability

                if hasattr(inst, "gamma"):
                    kwargs["gamma"] = inst.gamma

            # Calls function using args and kwargs
            instcall(*args, **kwargs)

        # Get measurement operations from IR
        results = ir.results

        # Adding of resulttypes
        for result in results:
            # Isolated cases for statevector and densitymatrix,
            # since they don't have matching names in both representations
            if result.type == "statevector":
                circuit.state_vector()
            elif result.type == "densitymatrix":
                circuit.density_matrix(target=result.targets)
            else:
                # Get operation
                instcall = getattr(circuit, f"{result.type}")
                kwargs = {}
                # Adding of parameters to kwargs
                if hasattr(result, "observable"):
                    kwargs["observable"] = Observable(len(result.targets), f"{(str(result.observable[0])).upper()}")
                if hasattr(result, "states"):
                    kwargs["states"] = result.states
                if hasattr(result, "targets"):
                    kwargs["target"] = result.targets

                # Calls function with arguments
                instcall(**kwargs)
        return circuit

    def circuit_to_language(self, circuit: Circuit) -> str:
        return circuit.to_ir().json(indent=4)
