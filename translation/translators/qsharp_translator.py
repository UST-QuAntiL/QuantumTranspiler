import json

import qiskit
import qsharp
import re
from qsharp.loader import QSharpCallable
from qiskit import QuantumCircuit, transpile, Aer
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qsharp import tk_to_qsharp
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from conversion.mappings.gate_mappings import gate_mapping_qsharp
from qiskit import ClassicalRegister
import pennylane as qml
import pystaq


class QsharpTranslator(Translator):
    name = TranslatorNames.QSHARP
    reg_counter = {}
    QSHARP_GATES_PYTKET = ["c3x", "c4x", "ccx", "dcx", "h", "crx", "cry", "cx",
                  "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "t", "x",
                  "y", "z", "measure"]

    QSHARP_GATES_STAQ = ["barrier", "c3x", "c4x", "ccx", "dcx", "h", "ch", "crx", "cry", "crz", "cswap", "cu1", "cu3", "cx", "cy", "cz",
                  "i", "id", "rccx", "ms", "rc3x", "rx", "rxx", "ry", "ryy", "rz", "rzx", "s", "sdg", "t", "tdg", "u1", "u2", "u3", "x", "y", "z"]

    def from_language(self, text: str) -> QuantumCircuit:
        self.reg_counter = {}
        # Create a qsharp callable from Q# string
        compiled = qsharp.compile(text)
        return self.compiled_to_circuit(compiled)

    def to_language(self, circuit: QuantumCircuit, framework: str = "Standard"):
        if framework.__eq__("Staq"):
            return self.to_language_staq(circuit)
        elif framework.__eq__("Pennylane"):
            return self.to_language_pl(circuit)
        elif framework.__eq__("Pytket") or framework.__eq__("Standard"):
            return self.to_language_tk(circuit)
        else:
            raise ValueError(f"Unsupported framework '{framework}'")
            
    def to_language_staq(self, circuit: QuantumCircuit) -> str:
        circuit = transpile(circuit, basis_gates=self.QSHARP_GATES_STAQ)
        circuit.data = [gate for gate in circuit.data if not gate[0].name == "barrier"]
        qasm = circuit.qasm()
        p: pystaq.Program = pystaq.parse_str(qasm)
        circ_qs = p.to_qsharp()
        #remove namespace
        circ_qs = re.findall(r'namespace Quantum\.staq \{\n(.*)\}', circ_qs, re.DOTALL)[0]
        #Fix controlled operations by swapping argument order:
        circ_qs = re.sub(r'(\(Controlled .*\()(.+?)(, )(.+?)(,.+)?(\);)', r"\1[\4]\3(\2\5)\6", circ_qs)
        return circ_qs


    def to_language_pl(self, circuit: QuantumCircuit) -> str:
        circuit.data = [gate for gate in circuit.data if not gate[0].name == "id"]
        wires = range(circuit.num_qubits)
        dev = qml.device('microsoft.QuantumSimulator', wires=wires)
        circ = qml.from_qiskit(circuit)
        @qml.qnode(dev)
        def new_circuit():
            # Add old circuit
            circ(wires=wires)
            return [qml.expval(qml.PauliZ(i)) for i in wires]
        new_circuit()
        source_str = f"""open Microsoft.Quantum.Intrinsic;
open Microsoft.Quantum.Canon;
{dev.source}"""

        source_str = re.sub(r'ResultArrayAsBoolArray\(resultArray\)', "resultArray", source_str)
        source_str = re.sub(r'Bool\[\]', "Result[]", source_str)
        return source_str




    def to_language_tk(self, circuit: QuantumCircuit) -> str:
        circuit = transpile(circuit, basis_gates=self.QSHARP_GATES_PYTKET)
        circuit.data = [gate for gate in circuit.data if not gate[0].name == "barrier"]
        return tk_to_qsharp(qiskit_to_tk(circuit))

    # Converts a compiled qsharp circuit into a qiskit quantum circuit
    def compiled_to_circuit(self, compiled: QSharpCallable) -> QuantumCircuit:
        if hasattr(compiled, '__len__'):
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
            if not target["cId"] in self.reg_counter or target["qId"] > self.reg_counter[target["cId"]]:
                self.reg_counter[target["cId"]] = target["qId"]


    # Builds a Qiskit Quantum circuit from a list of QSharp Gates
    def gatelist_to_circuit(self, gates: list, qubits: int) -> QuantumCircuit:
        # Instantiate with same amount of qubits as the Q# circuit
        circuit = QuantumCircuit(qubits)
        cregs = {}
        # Create registers from reg_counter dictionary
        for reg in self.reg_counter:
            creg = ClassicalRegister(size=self.reg_counter[reg]+1, name=f"c{reg}")
            cregs[reg]=creg
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
                        cargs.append(cregs[target["cId"]][target["qId"]])
                circuit.append(instr_qiskit, qargs=qargs, cargs=cargs)
            else:
                raise NotImplementedError(f"{gate_name} is not supported.{gate['gate']}")

        # Reset clreg counter for next translation

        return circuit


if __name__ == '__main__':
    trans = QsharpTranslator()
    ci = qiskit.QuantumCircuit(5,5)
    ci.h(0)
    ci.cnot(2,1)
    ci.ccx(4,3,2)
    trans_str=trans.to_language(ci, framework="Pennylane")
    print(trans_str)
    circ = trans.from_language(trans_str)
    print(circ)