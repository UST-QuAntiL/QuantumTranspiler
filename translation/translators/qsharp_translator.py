import qsharp
import json
from qsharp.loader import QSharpCallable
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qsharp import tk_to_qsharp
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from conversion.mappings.gate_mappings import gate_mapping_qsharp
from qiskit.circuit import Parameter as qiskit_Parameter


class QsharpTranslator(Translator):
    name = TranslatorNames.QSHARP

    def from_language(self, text: str) -> QuantumCircuit:
        compiled = qsharp.compile(text)
        return self.compiled_to_circuit(compiled)

    def to_language(self, circuit: QuantumCircuit) -> str:
        return tk_to_qsharp(qiskit_to_tk(circuit))

    # Converts a compiled qsharp circuit into a qiskit quantum circuit
    def compiled_to_circuit(self, compiled: QSharpCallable) -> QuantumCircuit:
        traced = compiled.trace()
        # print(json.dumps(traced, indent=4))
        # print(traced["qubits"])
        operations = traced["operations"]
        base_gates = []
        for operation in operations:
            base_gates.extend(self.get_gates(operation))
        # print(json.dumps(base_gates, indent=4))
        return self.gatelist_to_circuit(base_gates, len(traced["qubits"]))

    # extracts the list of base gates from the trace of a QSharpCallable which is a tree,
    # by getting called recursively until either a leaf node or a node that has a mapping is reached
    def get_gates(self, operation):
        if "children" not in operation or len(operation["children"]) == 0 or operation["gate"] in gate_mapping_qsharp:
            return [operation]
        else:
            lst = []
            for child in operation["children"]:
                lst.extend(self.get_gates(child))
            return lst

    # Builds a Qiskit Quantum circuit from a list of QSharp Gates
    def gatelist_to_circuit(self, gates: list, qubits: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubits, 1)
        for gate in gates:
            print(gate)
            gate_name = gate["gate"]
            if gate["isControlled"]:
                for i in enumerate(gate["controls"]):
                    gate_name = "C" + gate_name
            print(gate_name)
            if gate_name in gate_mapping_qsharp:
                if "g" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["g"]
                # replacement circuit
                elif "r" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["r"]
                params = []
                if "displayArgs" in gate:
                    print(f"Args: {gate['displayArgs']}")
                    arg = gate["displayArgs"][1:-1]
                    arg = arg.strip().replace(",", ".")
                    print(arg)
                    try:
                        params.append(float(arg))
                    except ValueError:
                        params.append(arg)

                instr_qiskit = instr_qiskit_class(*params)

                qargs = []
                for control in gate["controls"]:
                    qargs.append(control["qId"])
                for target in gate["targets"]:
                    qargs.append(target["qId"])
                print(instr_qiskit)
                print(qargs)
                print(circuit)
                circuit.append(instr_qiskit, qargs=qargs)

        return circuit
