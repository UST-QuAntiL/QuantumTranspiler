import numpy as np
from typing import Tuple, Dict, List
from qiskit.circuit import Qubit, Clbit
from conversion.converter.converter_interface import ConverterInterface
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
from qiskit import QuantumCircuit, transpile, ClassicalRegister, QuantumRegister
from braket.ir.jaqcd import Program
from braket.circuits.circuit import Circuit
from braket.circuits import Observable, observable
import braket
from braket.circuits import Instruction, FreeParameter
from braket.circuits.gates import Unitary
from braket.circuits.result_types import Sample
from conversion.mappings.gate_mappings import gate_mapping_braket
from qiskit.extensions import UnitaryGate
import qiskit.circuit.library.standard_gates as qiskit
import warnings


class BraketConverter(ConverterInterface):
    name = "braket"
    is_control_capable = False
    has_internal_export = False
    BRAKET_GATES = [
        "barrier",
        "c3x",
        "c4x",
        "ccx",
        "dcx",
        "h",
        "crx",
        "cry",
        "cswap",
        "cx",
        "cy",
        "cz",
        "i",
        "id",
        "rccx",
        "ms",
        "rc3x",
        "rx",
        "rxx",
        "ry",
        "ryy",
        "rz",
        "rzx",
        "s",
        "sdg",
        "t",
        "tdg",
        "x",
        "y",
        "z",
        "measure",
    ]

    def import_circuit(
        self, circuit: Circuit
    ) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        self.program = circuit
        qubit_set = circuit.qubits
        qreg_mapping = {}
        qr = QuantumRegister(max(qubit_set) + 1, "q")
        for counter, qubit in enumerate(qubit_set):
            qreg_mapping[qubit] = qr[qubit]
        creg_mapping = {}
        qcircuit = QuantumCircuit(qr)
        for instruction in circuit.instructions:
            if isinstance(instruction.operator, braket.circuits.gate.Gate):
                self._handle_gate_import(qcircuit, instruction, qreg_mapping)
        for result_type in circuit.result_types:
            if isinstance(result_type, braket.circuits.result_types.Sample):
                self._handle_result_import(
                    qcircuit, result_type, qreg_mapping, creg_mapping
                )
            else:
                raise NotImplementedError(
                    "Unsupported Result Type: " + result_type.name
                )

        return qcircuit, qreg_mapping, creg_mapping

    def _handle_gate_import(
        self,
        circuit: QuantumCircuit,
        instr: braket.circuits.instruction.Instruction,
        mapping,
    ) -> None:
        if instr.operator.name in gate_mapping_braket:
            # get the instruction
            if "g" in gate_mapping_braket[instr.operator.name]:
                instr_qiskit_class = gate_mapping_braket[instr.operator.name]["g"]
            # replacement circuit
            elif "r" in gate_mapping_braket[instr.operator.name]:
                instr_qiskit_class = gate_mapping_braket[instr.operator.name]["r"]
            else:
                raise NameError(
                    "Gate defined in gate mapping but neither gate nor replacement circuit is given: "
                    + str(instr)
                )
            qargs = []
            for qbit in instr.target:
                qargs.append(mapping[qbit])
            if hasattr(instr.operator, "angle"):
                angle = instr.operator.angle
                circuit.append(instr_qiskit_class(angle), qargs=qargs)
            else:
                circuit.append(instr_qiskit_class(), qargs=qargs)
        elif isinstance(instr.operator, braket.circuits.gates.Gate):
            qargs = []
            # Qiskit Unitary Gates use reverse Qubit order!
            for qbit in reversed(instr.target):
                qargs.append(mapping[qbit])
            gate = UnitaryGate(instr.operator.to_matrix(), label=instr.operator.name)
            circuit.append(gate, qargs=qargs)
        else:
            raise NotImplementedError("Unsupported Instruction: " + str(instr))

    def _handle_result_import(
        self, circuit: QuantumCircuit, result_type, qreg_mapping, creg_mapping
    ):
        if isinstance(result_type.observable, Observable.Z):
            if len(result_type.target) == 0:
                qbits = qreg_mapping.keys()
            else:
                qbits = result_type.target
            creg = ClassicalRegister(len(qbits))
            circuit.add_register(creg)
            for i, qbit in enumerate(qbits):
                circuit.measure(qreg_mapping[qbit], creg[i])
                if qbit in creg_mapping.keys():
                    creg_mapping[qbit].append(creg[i])
                else:
                    creg_mapping[qbit] = [creg[i]]
        elif isinstance(result_type.observable, Observable.Y):
            if len(result_type.target) == 0:
                qbits = qreg_mapping.keys()
            else:
                qbits = result_type.target
            creg = ClassicalRegister(len(qbits))
            circuit.add_register(creg)
            for i, qbit in enumerate(qbits):
                circuit.sdg(qreg_mapping[qbit])
                circuit.h(qreg_mapping[qbit])
                circuit.measure(qreg_mapping[qbit], creg[i])
                if qbit in creg_mapping.keys():
                    creg_mapping[qbit].append(creg[i])
                else:
                    creg_mapping[qbit] = [creg[i]]
        elif isinstance(result_type.observable, Observable.X):
            if len(result_type.target) == 0:
                qbits = qreg_mapping.keys()
            else:
                qbits = result_type.target
            creg = ClassicalRegister(len(qbits))
            circuit.add_register(creg)
            for i, qbit in enumerate(qbits):
                circuit.h(qreg_mapping[qbit])
                circuit.measure(qreg_mapping[qbit], creg[i])
                if qbit in creg_mapping.keys():
                    creg_mapping[qbit].append(creg[i])
                else:
                    creg_mapping[qbit] = [creg[i]]
        else:
            raise NotImplementedError(
                "Observable not supported: " + str(result_type.observable)
            )

    def export_circuit(self, qcircuit: QuantumCircuit):
        raise NotImplementedError()

    @property
    def circuit(self):
        return self.program

    def init_circuit(self):
        self.program = Circuit()

    def create_qreg_mapping(self, qreg_mapping, qubit: Qubit, index: int):
        qreg_mapping[qubit] = index
        return qreg_mapping

    def create_creg_mapping(self, cregs: List[ClassicalRegister]):
        creg_mapping = {}
        for cr in cregs:
            for i, clbit in enumerate(cr):
                creg_mapping[clbit] = i

        return creg_mapping

    def gate(
        self, gate, qubits, params, is_controlled=False, num_qubits_base_gate=None
    ):
        self.program.add_instruction(Instruction(gate(*params), qubits))

    def custom_gate(self, matrix, name, qubits, params=[]):
        if len(params) > 0:
            raise NotImplementedError("Custom gates in Braket do not support params.")
        # Qiskit Unitary Gates use reverse Qubit order!
        qubits.reverse()
        self.program.add_instruction(Instruction(Unitary(matrix, name), qubits))

    def parameter_conversion(self, parameter: qiskit_Parameter):
        return FreeParameter(parameter.name)

    def parameter_expression_conversion(self, parameter: qiskit_Parameter_expression):
        if len(parameter.parameters) == 0:
            return float(parameter._symbol_expr)
        else:
            raise NotImplementedError(
                "Parameter Expressions with unbound parameters are not supported: "
                + str(parameter)
            )

    def barrier(self, qubits):
        warnings.warn("The Barrier operation is skipped in the braket circuit.")
        return

    def measure(self, qubit, clbit):
        warnings.warn(
            "Measurement operations will be added to the END of the circuit only!"
        )
        self.program.add_result_type(Sample(Observable.Z(), qubit))

    def subcircuit(self, subcircuit, qubits, clbits=None):
        self.program.add(subcircuit, target=qubits)

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
                    obscall = getattr(
                        Observable, f"{(str(result.observable[0])).upper()}"
                    )
                    kwargs["observable"] = obscall()
                if hasattr(result, "states"):
                    kwargs["states"] = result.states
                if hasattr(result, "targets"):
                    kwargs["target"] = result.targets

                # Calls function with arguments
                instcall(**kwargs)
        return circuit

    def circuit_to_language(self, circuit: Circuit) -> str:
        return circuit.to_ir().json(indent=4)
