import qsharp
import re
from qsharp.loader import QSharpCallable
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qsharp import tk_to_qsharp
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from conversion.mappings.gate_mappings import gate_mapping_qsharp
from qiskit.circuit import Parameter as qiskit_Parameter
from qiskit import ClassicalRegister
from qiskit.circuit import Clbit
import pennylane as qml
import pystaq

class QsharpTranslator(Translator):
    name = TranslatorNames.QSHARP
    reg_counter = {}

    def from_language(self, text: str) -> QuantumCircuit:
        compiled = qsharp.compile(text)

        return self.compiled_to_circuit(compiled)

    def to_language(self, circuit: QuantumCircuit) -> str:
        p: pystaq.Program = pystaq.parse_str(circuit.qasm())
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
            # Add your old circuit
            circ(wires=wires)
            return qml.expval(qml.PauliZ(0))
        new_circuit()
        source_str = dev.source
        return source_str
    

        

    def to_language_tk(self, circuit: QuantumCircuit) -> str:
        circuit.data = [gate for gate in circuit.data if not gate[0].name == "id"]
        return tk_to_qsharp(qiskit_to_tk(circuit))

    # Converts a compiled qsharp circuit into a qiskit quantum circuit
    def compiled_to_circuit(self, compiled: QSharpCallable) -> QuantumCircuit:
        if len(compiled) > 1:
            compiled = compiled[-1]
        traced = compiled.trace()
        #print(compiled.estimate_resources())
        #print(json.dumps(traced, indent=4))
        #print(traced["qubits"])
        operations = traced["operations"]
        base_gates = []
        for operation in operations:
            base_gates.extend(self.get_gates(operation))
        #print(json.dumps(base_gates, indent=4))
        return self.gatelist_to_circuit(base_gates, len(traced["qubits"]))

    # extracts the list of base gates from the trace of a QSharpCallable which is a tree,
    # by getting called recursively until either a leaf node or a node that has a mapping is reached
    def get_gates(self, operation):
        if operation["isControlled"]:
            for i in enumerate(operation["controls"]):
                operation["gate"] = "C" + operation["gate"]
        if not (operation["gate"] == "Reset" or operation["gate"] == "MResetZ"):
            if "children" not in operation or len(operation["children"]) == 0 or operation["gate"] in gate_mapping_qsharp:
                if operation["isMeasurement"]:
                    self.create_cregs(operation)
                return [operation]
            else:
                lst = []
                for child in operation["children"]:
                    lst.extend(self.get_gates(child))
                return lst
        else:
            return []
        
    #Creates a dictionary of cregs and clbits to initiate the ciruit with later
    def create_cregs(self, gate):
        for target in gate["targets"]:
            if not target["cId"] in self.reg_counter or target["qId"] > self.reg_counter[target["cId"]]:
                self.reg_counter[target["cId"]] = target["qId"]


    # Builds a Qiskit Quantum circuit from a list of QSharp Gates
    def gatelist_to_circuit(self, gates: list, qubits: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubits)
        cregs = {}
        for reg in self.reg_counter:
            creg = ClassicalRegister(size=self.reg_counter[reg]+1, name=f"c{reg}")
            cregs[reg]=creg
            circuit.add_register(creg)
        #print(cregs)
        for gate in gates:
            gate_name = gate["gate"]

            if gate_name in gate_mapping_qsharp:
                if "g" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["g"]
                # replacement circuit
                elif "r" in gate_mapping_qsharp[gate_name]:
                    instr_qiskit_class = gate_mapping_qsharp[gate_name]["r"]
                params = []
                if "displayArgs" in gate:
                    arg = gate["displayArgs"][1:-1]
                    arg = arg.strip().replace(",", ".")
                    try:
                        params.append(float(arg))
                    except ValueError:
                        params.append(arg)
                #print(instr_qiskit_class)

                instr_qiskit = instr_qiskit_class(*params)

                qargs = []
                cargs = []
                for control in gate["controls"]:
                    qargs.append(control["qId"])
                for target in gate["targets"]:
                    if not gate["isMeasurement"]:
                        qargs.append(target["qId"])
                    else:
                        #print(target["cId"])
                        #print(cregs[target["cId"]])
                        #print(target["qId"])
                        cargs.append(cregs[target["cId"]][target["qId"]])
                #print(instr_qiskit)
                #print(qargs)
                #print(cargs)
                circuit.append(instr_qiskit, qargs=qargs, cargs=cargs)
                #print(circuit)
            else:
                print(gate)
                print("Landed here")
                raise NotImplementedError(f"{gate_name} is not supported.{gate['gate']}")

        self.reg_counter = {}
        return circuit

if __name__ == '__main__':
    trans = QsharpTranslator()
    qs = """open Microsoft.Quantum.Intrinsic;
    open Microsoft.Quantum.Convert;
    open Microsoft.Quantum.Canon;
    open Microsoft.Quantum.Math;

    operation U(theta : Double, phi : Double, lambda : Double, q : Qubit) : Unit {
        Rz(lambda, q);
        Ry(theta, q);
        Rz(phi, q);
    }

    operation u3(theta : Double, phi : Double, lambda : Double, q : Qubit) : Unit {
        U(theta, phi, lambda, q);
    }

    operation u2(phi : Double, lambda : Double, q : Qubit) : Unit {
        U(PI()/2.0, phi, lambda, q);
    }

    operation u0(gamma : Double, q : Qubit) : Unit {
        U(0.0, 0.0, 0.0, q);
    }

    operation r(theta : Double, phi : Double, a : Qubit) : Unit {
        u3(theta, phi-(PI()/2.0), -phi+(PI()/2.0), a);
    }

    operation cy(a : Qubit, b : Qubit) : Unit {
        (Adjoint S)(b);
        CNOT(a, b);
        S(b);
    }

    operation swap(a : Qubit, b : Qubit) : Unit {
        CNOT(a, b);
        CNOT(b, a);
        CNOT(a, b);
    }

    operation cswap(a : Qubit, b : Qubit, c : Qubit) : Unit {
        CNOT(c, b);
        CCNOT(a, b, c);
        CNOT(c, b);
    }

    operation cu3(theta : Double, phi : Double, lambda : Double, c : Qubit, t : Qubit) : Unit {
        Rz((lambda+phi)/2.0, c);
        Rz((lambda-phi)/2.0, t);
        CNOT(c, t);
        u3(-theta/2.0, 0.0, -(phi+lambda)/2.0, t);
        CNOT(c, t);
        u3(theta/2.0, phi, 0.0, t);
    }

    operation Circuit() : Unit {
        using (q = Qubit[4]) {
            mutable c = new Result[4];
            H(q[0]);
            cu3(5.95335, 5.9837, 3.70626, q[2], q[1]);
            u2(2.10211, 5.33459, q[3]);
            cu3(6.08472, 2.33356, 5.71297, q[3], q[2]);
            (Controlled Rz)([q[0]], (1.99985, q[1]));
            set c w/= 0 <- M(q[0]);
            set c w/= 1 <- M(q[1]);
            set c w/= 2 <- M(q[2]);
            set c w/= 3 <- M(q[3]);

            ResetAll(q);
        }
    }"""
    print(trans.from_language(qs))