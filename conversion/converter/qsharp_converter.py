from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qsharp import tk_to_qsharp
from qiskit import QuantumCircuit, ClassicalRegister, transpile
from typing import Tuple, Dict, List, Union
from qiskit.circuit import Qubit, Clbit
from qsharp import QSharpCallable
import warnings
from conversion.converter.converter_interface import ConverterInterface
from conversion.mappings.gate_mappings import gate_mapping_qsharp
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit.circuit import ParameterExpression as qiskit_Parameter_expression
import qsharp


class QsharpConverter(ConverterInterface):
    QSHARP_GATES = [
        "ccx",
        "i",
        "id",
        "h",
        "cx",
        "rx",
        "ry",
        "rz",
        "s",
        "t",
        "x",
        "y",
        "z",
        "measure",
        "swap",
    ]
    name = "qsharp"
    is_control_capable = True
    has_internal_export = True

    def __init__(self):
        self.reg_counter = {}

    def import_circuit(
        self, circuit
    ) -> Tuple[QuantumCircuit, Dict[int, Qubit], Dict[str, Clbit]]:
        self.reg_counter = {}
        # Create a qsharp callable from Q# string
        compiled = qsharp.compile(circuit)
        qcircuit = self.compiled_to_circuit(compiled)
        qreg_mapping = {}
        for counter, qubit in enumerate(qcircuit.qubits):
            qreg_mapping[counter] = qubit
        creg_mapping = {}
        for counter, clbit in enumerate(qcircuit.clbits):
            creg_mapping[str(counter)] = clbit
        return qcircuit, qreg_mapping, creg_mapping

    # Converts a compiled qsharp circuit into a qiskit quantum circuit
    def compiled_to_circuit(
        self, compiled: Union[QSharpCallable, List[QSharpCallable]]
    ) -> QuantumCircuit:
        if hasattr(compiled, "__len__"):
            compiled = compiled[-1]
        traced = compiled.trace()
        operations = traced["operations"]
        base_gates = []
        for operation in operations:
            base_gates.extend(self.get_gates(operation))
        return self.gatelist_to_circuit(base_gates, len(traced["qubits"]))

    # extracts the list of base gates from the trace of a QSharpCallable which is a tree,
    # by getting called recursively until node that has a mapping is reached
    def get_gates(self, operation):
        # Renames controlled operations, since Q# does not differentiate them in name, causing mapping issues.
        if operation["isControlled"]:
            for i in enumerate(operation["controls"]):
                operation["gate"] = "C" + operation["gate"]
        # If an operation is mappable, add it to the list
        if operation["gate"] in gate_mapping_qsharp:
            if operation["isMeasurement"]:
                # If an operation is a measurement, it has a target clbit, so we have to memorize it.
                self.create_cregs(operation)
            return [operation]
        # If not, but it has children it can be decomposed to, call recursively
        elif "children" in operation and len(operation["children"]) != 0:
            lst = []
            for child in operation["children"]:
                lst.extend(self.get_gates(child))
            return lst
        # In case we reach an unsupported leaf node, we raise an exception
        else:
            raise NotImplementedError(f"Gate {operation['gate']} is not supported")

    # Creates a dictionary of cregs and clbits to add to the Qiskit Circuit for measurement purposes
    def create_cregs(self, gate):
        for target in gate["targets"]:
            # qId is the qbit that measured
            # cId is (probably) the amount of measurement and resets performed on it up to this point
            # We note every instance of a measurement as a pair of qbit and cId
            q_list = self.reg_counter.get(target["qId"], [])
            q_list.append(target["cId"])
            self.reg_counter[target["qId"]] = q_list

    # Builds a Qiskit Quantum circuit from a list of QSharp Gates
    def gatelist_to_circuit(self, gates: list, qubits: int) -> QuantumCircuit:
        # Instantiate with same amount of qubits as the Q# circuit
        circuit = QuantumCircuit(qubits)
        cregs = {}
        # Create registers from reg_counter dictionary
        # There is a separate register for every qbit, with an amount of bits equal to the times the bit got measured.
        # For identification which clbit belongs to which measurement, the (qbit, measurement no. i) pair is used.
        # The reg is sorted, since the order of measurements does not actually correspond their order in the result.
        # Ordering increases the chance to get the original order.
        for reg in sorted(self.reg_counter):
            warnings.warn("Measurements will be ordered by QBit Id!")
            creg = ClassicalRegister(size=len(self.reg_counter[reg]), name=f"c{reg}")
            for i in range(len(self.reg_counter[reg])):
                cregs[(reg, self.reg_counter[reg][i])] = creg[i]
            circuit.add_register(creg)
        # Iterates over gate and adds corresponding Qiskit Operation to circuit.
        for gate in gates:
            gate_name = gate["gate"]

            if gate_name in gate_mapping_qsharp:
                if "g" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["g"]
                # replacement circuit
                elif "r" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["r"]
                params = []
                # Converts args from string if necessary.
                if "displayArgs" in gate:
                    arg = gate["displayArgs"][1:-1]
                    arg = arg.strip().replace(",", ".")
                    try:
                        params.append(float(arg))
                    except ValueError:
                        params.append(arg)

                # Operation instantiated with args

                instr_qiskit = instr_qiskit_class(*params)

                qargs = []
                cargs = []
                for control in gate["controls"]:
                    qargs.append(control["qId"])
                for target in gate["targets"]:
                    if not gate["isMeasurement"]:
                        qargs.append(target["qId"])
                    else:
                        # (Qbit, No. Measurement) used as identification
                        cargs.append(cregs[(target["qId"], target["cId"])])
                circuit.append(instr_qiskit, qargs=qargs, cargs=cargs)
            else:
                raise NotImplementedError(
                    f"{gate_name} is not supported.{gate['gate']}"
                )
        # Reset clreg counter for next translation
        return circuit

    def export_circuit(self, qcircuit: QuantumCircuit):
        qcircuit = transpile(qcircuit, basis_gates=self.QSHARP_GATES)
        qcircuit.data = [
            gate
            for gate in qcircuit.data
            if not (gate[0].name == "barrier" or gate[0].name == "id")
        ]
        circuit = tk_to_qsharp(qiskit_to_tk(qcircuit))
        return circuit

    @property
    def circuit(self):
        return self.program

    def init_circuit(self):
        raise NotImplementedError()

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
        raise NotImplementedError()

    def circuit_to_language(self, circuit) -> str:
        raise NotImplementedError()
