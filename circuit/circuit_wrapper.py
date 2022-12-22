from cirq import Circuit
from qiskit.transpiler.coupling import CouplingMap
from conversion.converter.converter_interface import ConverterInterface
from transpilation.topology_mapping import swap, swap_direction
from circuit.qiskit_utility import count_gate_times, count_two_qubit_gates
from qiskit.execute_function import execute
from conversion.converter.command_converter import (
    circuit_to_pyquil_commands,
    circuit_to_qiskit_commands,
    pyquil_commands_to_program,
    qiskit_commands_to_circuit,
    cirq_commands_to_circuit,
    braket_commands_to_circuit,
)
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.dagcircuit.dagcircuit import DAGCircuit
from qiskit.transpiler.passes.basis import decompose
from conversion.conversion_handler import ConversionHandler
from conversion.converter.pyquil_converter import PyquilConverter
from conversion.converter.cirq_converter import CirqConverter
from conversion.converter.braket_converter import BraketConverter
from conversion.converter.qsharp_converter import QsharpConverter
from conversion.converter.quirk_converter import QuirkConverter
from pyquil import Program
from qiskit.converters import circuit_to_dag, dag_to_circuit
from transpilation.decompose import Decomposer
from transpilation.unroll import Unroller
from typing import List, Tuple
from qiskit_aer import AerSimulator
import cirq
import cirq_google as cg
from cirq.contrib.qasm_import import circuit_from_qasm


class CircuitWrapper:
    def __init__(
        self, qiskit_circuit: QuantumCircuit = None, qiskit_instructions: str = None
    ):

        if qiskit_circuit:
            self._set_circuit(qiskit_circuit)
        elif qiskit_instructions:
            self.import_qiskit(qiskit_instructions)
        else:
            self._set_circuit(QuantumCircuit())
            self.qreg_mapping_import = {}
            self.creg_mapping_import = {}
            self.qreg_mapping_export = {}
            self.creg_mapping_export = {}

    def _import(self, converter: ConverterInterface, circuit, is_language: bool):
        handler = ConversionHandler(converter)
        if is_language:
            (
                circuit,
                self.qreg_mapping_import,
                self.creg_mapping,
            ) = handler.import_language(circuit)
        else:
            (
                circuit,
                self.qreg_mapping_import,
                self.creg_mapping,
            ) = handler.import_circuit(circuit)
        self._set_circuit(circuit)

    def _set_circuit(self, circuit: QuantumCircuit):
        self.circuit = circuit
        self.dag = circuit_to_dag(circuit)

    def import_language(self, circuit, language):
        language_lower = language.lower()
        if language_lower == "quil":
            self.import_quil(circuit)
        elif language_lower == "pyquil":
            self.import_pyquil(circuit)
        elif language_lower == "openqasm":
            self.import_qasm(circuit)
        elif language_lower == "qiskit":
            self.import_qiskit(circuit)
        elif language_lower == "cirq":
            self.import_cirq_json(circuit)
        elif language_lower == "cirqsdk":
            self.import_cirq(circuit)
        elif language_lower == "braket":
            self.import_braket_ir(circuit)
        elif language_lower == "braketsdk":
            self.import_braket(circuit)
        elif language_lower == "qsharp":
            self.import_qsharp(circuit)
        elif language_lower == "quirk":
            self.import_quirk(circuit)
        else:
            raise ValueError("Unsupported language")

    def import_circuit(self, circuit: QuantumCircuit):
        self._set_circuit(circuit)

    def import_qasm(self, qasm: str):
        circuit = QuantumCircuit.from_qasm_str(qasm)
        self._set_circuit(circuit)

    def import_qiskit(self, circuit: str):
        circuit = qiskit_commands_to_circuit(circuit)
        self._set_circuit(circuit)

    def import_pyquil(self, circuit: str) -> None:
        program = pyquil_commands_to_program(circuit)
        converter = PyquilConverter()
        self._import(converter, program, False)

    def import_quil(self, quil: str) -> None:
        converter = PyquilConverter()
        self._import(converter, quil, True)

    def import_pyquil_circuit(self, program: Program):
        converter = PyquilConverter()
        self._import(converter, program, False)

    def import_cirq(self, circuit: str) -> None:
        ccircuit = cirq_commands_to_circuit(circuit)
        converter = CirqConverter()
        self._import(converter, ccircuit, False)

    def import_cirq_json(self, cirq: str) -> None:
        converter = CirqConverter()
        self._import(converter, cirq, True)

    def import_cirq_circuit(self, circuit: Circuit) -> None:
        converter = CirqConverter()
        self._import(converter, circuit, False)

    def import_braket(self, circuit: str) -> None:
        circuit = braket_commands_to_circuit(circuit)
        converter = BraketConverter()
        self._import(converter, circuit, False)

    def import_braket_ir(self, braket: str) -> None:
        converter = BraketConverter()
        self._import(converter, braket, True)

    def import_braket_circuit(self, circuit) -> None:
        converter = BraketConverter()
        self._import(converter, circuit, False)

    def import_qsharp(self, qsharp: str) -> None:
        converter = QsharpConverter()
        self._import(converter, qsharp, False)

    def import_quirk(self, quirk: str) -> None:
        converter = QuirkConverter()
        self._import(converter, quirk, True)

    def _export(
        self, converter: ConverterInterface, circuit: QuantumCircuit, is_language: bool
    ):
        handler = ConversionHandler(converter)
        if is_language:
            (
                circuit,
                self.qreg_mapping_export,
                self.creg_mapping_export,
            ) = handler.export_language(circuit)
        else:
            (
                circuit,
                self.qreg_mapping_export,
                self.creg_mapping_export,
            ) = handler.export_circuit(circuit)

        return circuit

    def export_language(self, language):
        language_lower = language.lower()
        if language_lower == "quil":
            return self.export_quil()
        elif language_lower == "pyquil":
            return self.export_pyquil_commands()
        elif language_lower == "openqasm":
            return self.export_qasm()
        elif language_lower == "qiskit":
            return self.export_qiskit_commands()
        elif language_lower == "cirq":
            return self.export_cirq_json()
        elif language_lower == "braket":
            return self.export_braket_ir()
        elif language_lower == "qsharp":
            return self.export_qsharp()
        elif language_lower == "quirk":
            return self.export_quirk()
        else:
            raise ValueError("Unsupported language")

    def export_pyquil(self) -> Program:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        converter = PyquilConverter()
        return self._export(converter, circuit, False)

    def export_quil(self) -> str:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        converter = PyquilConverter()
        return self._export(converter, circuit, True)

    def export_qiskit(self) -> QuantumCircuit:
        return self.circuit

    def export_qasm(self) -> str:
        (circuit, _) = self.decompose_to_standard_gates_return()
        qasm = circuit.qasm()
        return qasm

    def export_qiskit_commands(self, include_imports=True) -> str:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        instructions = circuit_to_qiskit_commands(circuit, include_imports)
        return instructions

    def export_pyquil_commands(self) -> str:
        (circuit, dag) = self.decompose_non_standard_non_unitary_gates_return()
        program = self.export_pyquil()
        instructions = circuit_to_pyquil_commands(program)
        return instructions

    def export_cirq(self) -> Circuit:
        self.decompose_to_standard_gates()
        converter = CirqConverter()
        return self._export(converter, self.circuit, False)

    def export_cirq_json(self) -> str:
        self.decompose_to_standard_gates()
        converter = CirqConverter()
        return self._export(converter, self.circuit, True)

    def export_braket(self):
        self.decompose_to_standard_gates()
        converter = BraketConverter()
        return self._export(converter, self.circuit, False)

    def export_braket_ir(self) -> str:
        self.decompose_to_standard_gates()
        converter = BraketConverter()
        return self._export(converter, self.circuit, True)

    def export_qsharp(self) -> str:
        self.decompose_to_standard_gates()
        converter = QsharpConverter()
        return self._export(converter, self.circuit, False)

    def export_quirk(self) -> str:
        self.decompose_to_standard_gates()
        converter = QuirkConverter()
        return self._export(converter, self.circuit, True)

    #  decomposing and unrolling functionality
    def decompose_to_standard_gates(self) -> None:
        (self.circuit, self.dag) = self.decompose_to_standard_gates_return()

    def decompose_to_standard_gates_return(self) -> Tuple[QuantumCircuit, DAGCircuit]:
        decomposer = Decomposer()
        dag = decomposer.decompose_to_standard_gates(self.dag)
        circuit = dag_to_circuit(dag)
        return (circuit, dag)

    def decompose_non_standard_non_unitary_gates(self) -> None:
        (
            self.circuit,
            self.dag,
        ) = self.decompose_non_standard_non_unitary_gates_return()

    def decompose_non_standard_non_unitary_gates_return(
        self,
    ) -> Tuple[QuantumCircuit, DAGCircuit]:
        decomposer = Decomposer()
        dag = decomposer.decompose_non_standard_non_unitary_gates(self.dag)
        circuit = dag_to_circuit(dag)
        return (circuit, dag)

    def unroll_ibm(self) -> QuantumCircuit:
        return self.unroll(["u1", "u2", "u3", "cx", "id"])

    def unroll_rigetti(self) -> QuantumCircuit:
        return self.unroll(["rx", "rz", "cz", "id"])

    def unroll_sycamore(self) -> QuantumCircuit:
        circ = circuit_from_qasm(self.circuit.qasm())
        sycamore_circ = cg.optimized_for_sycamore(circ)
        self.import_cirq_circuit(sycamore_circ)
        return self.circuit

    def unroll_azure(self) -> QuantumCircuit:
        qshrap_opt = self.export_qsharp()
        self.import_qsharp(qshrap_opt)
        return self.circuit

    def unroll(self, gates: List[str]) -> QuantumCircuit:
        unroll_pass = Unroller(gates)
        self.decompose_non_standard_non_unitary_gates()
        self.dag = unroll_pass.run(self.dag)
        self.circuit = dag_to_circuit(self.dag)
        return self.circuit

    # topology mapping
    def topology_mapping(self, coupling: CouplingMap):
        self.circuit = swap(self.circuit, coupling)
        self.dag = circuit_to_dag(self.circuit)
        # needed to swap direction of the gates if the coupling_map is not symmetric
        if not coupling.is_symmetric:
            # rigetti's coupling_maps are symmetric because of cz as native gate instead of cx
            self.unroll_ibm()
            self.circuit = swap_direction(self.circuit, coupling)
            self.dag = circuit_to_dag(self.circuit)

    def simulate(self, shots=1000):
        simulator = AerSimulator()
        result = execute(self.circuit, simulator, shots=shots).result()
        counts = result.get_counts(self.circuit)
        return counts

    # analysis
    def depth(self):
        return self.dag.depth()

    def depth_gate_times(self):
        """
        considers the number of frame changes needed to implement a specific operation
        e.g. U1: 0
        U2: 1
        U3: 2
        """
        ops_path = self.dag.count_ops_longest_path()
        count = count_gate_times(ops_path)
        return count

    def depth_two_qubit_gates(self):
        """
        considers the number of the two qubit gates: cz, cx and cy (which include the native two qubit gates from rigetti -cz- and ibm -cx-)
        """
        ops_path = self.dag.count_ops_longest_path()
        count = count_two_qubit_gates(ops_path)
        return count

    def compare_depth_topology(
        self, coupling: CouplingMap, depth_method, ibm: bool = True
    ):
        if ibm:
            self.unroll_ibm()
        else:
            self.unroll_rigetti()
        depth = depth_method()
        self.topology_mapping(coupling)
        if ibm:
            self.unroll_ibm()
        else:
            self.unroll_rigetti()
        depth_mapped = depth_method()
        print("Depth before topology mapping: " + str(depth))
        print("Depth after topology mapping: " + str(depth_mapped))
        print("Increase: " + str(depth_mapped / depth))
