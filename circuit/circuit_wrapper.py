from qiskit.transpiler.coupling import CouplingMap
from transpilation.topology_mapping import swap, swap_direction
from circuit.qiskit_utility import count_gate_times, count_two_qubit_gates
from qiskit.execute import execute
from conversion.converter.command_converter import circuit_to_qiskit_commands, pyquil_commands_to_program, qiskit_commands_to_circuit
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.dagcircuit.dagcircuit import DAGCircuit
from qiskit.transpiler.passes.basis import decompose
from conversion.conversion_handler import ConversionHandler
from conversion.converter.pyquil_converter import PyquilConverter
from pyquil import Program
from qiskit.converters import circuit_to_dag, dag_to_circuit
from transpilation.decompose import Decomposer
from transpilation.unroll import Unroller
from typing import List, Tuple
from qiskit.providers.aer import QasmSimulator


class CircuitWrapper:
    def __init__(self, pyquil_program: Program = None, quil_str: str = None, qiskit_circuit: QuantumCircuit = None, qasm: str = None, pyquil_instructions: str = None, qiskit_instructions: str = None):
        if pyquil_program:
            self.import_pyquil(pyquil_program)
        elif quil_str:
            self.import_quil(quil_str)
        elif qiskit_circuit:
            self._set_circuit(qiskit_circuit)
        elif qasm:
            self.import_qasm(qasm)
        elif pyquil_instructions:
            program = pyquil_commands_to_program(pyquil_instructions)
            self.import_pyquil(program)
        elif qiskit_instructions:
            self._set_circuit(qiskit_commands_to_circuit(qiskit_instructions))
        else:
            self._set_circuit(QuantumCircuit())
            self.qreg_mapping_import = {}
            self.creg_mapping_import = {}
            self.qreg_mapping_export = {}
            self.creg_mapping_export = {}

    def _import(self, handler: ConversionHandler, circuit, is_language: bool):
        if is_language:
            (circuit, self.qreg_mapping_import,
             self.creg_mapping) = handler.import_language(circuit)
        else:
            (circuit, self.qreg_mapping_import,
             self.creg_mapping) = handler.import_circuit(circuit)
        self._set_circuit(circuit)

    def _set_circuit(self, circuit: QuantumCircuit):
        self.circuit = circuit
        self.dag = circuit_to_dag(circuit)

    def import_qasm(self, qasm: str):
        circuit = QuantumCircuit.from_qasm_str(qasm)
        self._set_circuit(circuit)

    def import_pyquil(self, program: Program) -> None:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        self._import(handler, program, False)

    def import_quil(self, quil: str) -> None:
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        self._import(handler, quil, True)

    def _export(self, handler: ConversionHandler, circuit: DAGCircuit, is_language: bool):
        if is_language:
            (circuit, self.qreg_mapping_export,
             self.creg_mapping_export) = handler.export_language(circuit)
        else:
            (circuit, self.qreg_mapping_export,
             self.creg_mapping_export) = handler.export_circuit(circuit)

        return circuit

    def export_pyquil(self) -> Program:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        return self._export(handler, circuit, False)

    def export_quil(self) -> str:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        converter = PyquilConverter()
        handler = ConversionHandler(converter)
        return self._export(handler, circuit, True)

    def export_qiskit(self) -> QuantumCircuit:
        return self.circuit

    def export_qasm(self) -> str:
        (circuit, _) = self.decompose_to_standard_gates_return()
        qasm = circuit.qasm()
        return qasm

    def export_qiskit_commands(self) -> str:
        (circuit, _) = self.decompose_non_standard_non_unitary_gates_return()
        # print(circuit)
        instructions = circuit_to_qiskit_commands(circuit)
        return instructions

    def export_pyquil_commands(self) -> str:
        (circuit, dag) = self.decompose_non_standard_non_unitary_gates_return()
        raise NotImplementedError(
            "Conversion to Pyquil Commands is not implemented. Export export_pyquil or export_quil should be used.")

    #  decomposing and unrolling functionality
    def decompose_to_standard_gates(self) -> None:
        (self.circuit, self.dag) = self.decompose_to_standard_gates_return()

    def decompose_to_standard_gates_return(self) -> Tuple[QuantumCircuit, DAGCircuit]:
        decomposer = Decomposer()
        dag = decomposer.decompose_to_standard_gates(self.dag)
        circuit = dag_to_circuit(dag)
        return (circuit, dag)

    def decompose_non_standard_non_unitary_gates(self) -> None:
        (self.circuit, self.dag) = self.decompose_non_standard_non_unitary_gates_return()

    def decompose_non_standard_non_unitary_gates_return(self) -> Tuple[QuantumCircuit, DAGCircuit]:
        decomposer = Decomposer()
        dag = decomposer.decompose_non_standard_non_unitary_gates(self.dag)
        circuit = dag_to_circuit(dag)
        return (circuit, dag)

    def unroll_ibm(self) -> QuantumCircuit:
        return self.unroll(["u1", "u2", "u3", "cx", "id"])

    def unroll_rigetti(self) -> QuantumCircuit:
        return self.unroll(["rx", "rz", "cz", "id"])

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
        simulator = QasmSimulator()
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

    def compare_depth_topology(self, coupling: CouplingMap, depth_method, ibm: bool = True):
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
        print("Increase: " + str(depth_mapped/depth))

