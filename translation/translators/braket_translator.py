import numpy as np
from qiskit import QuantumCircuit
from pytket.extensions.qiskit import qiskit_to_tk
from pytket.extensions.qiskit import tk_to_qiskit
from pytket.extensions.braket import tk_to_braket
from pytket.extensions.braket import braket_to_tk
from translation.translators.translator import Translator
from translation.translator_names import TranslatorNames
from braket.ir.jaqcd import Program
from braket.circuits import Circuit
from braket.circuits import Observable
import pennylane as qml

class BraketTranslator(Translator):
    name= TranslatorNames.BRAKET

    def from_language(self, text: str) -> QuantumCircuit:
        program = Program.parse_raw(text)
        return tk_to_qiskit(braket_to_tk(self.ir_to_circuit(program)))

    def to_language(self, circuit: QuantumCircuit) -> str:
        circuit.data = [gate for gate in circuit.data if not gate[0].name == "id"]
        wires = range(circuit.num_qubits)
        dev = qml.device('braket.local.qubit', wires=wires)
        circ = qml.from_qiskit(circuit)
        @qml.qnode(dev)
        def new_circuit():
            # Add your old circuit
            circ(wires=wires)
            return qml.expval(qml.PauliZ(0))
        new_circuit()
        program: Circuit = dev.circuit
        #remove the measurement that was necessary for Pennylane
        new_program: Circuit = Circuit()
        for inst in program.instructions:
            new_program.add_instruction(inst)
        return new_program.to_ir().json(indent=4)

    def to_language_tk(self, circuit: QuantumCircuit) -> str:
        program: Circuit = tk_to_braket(qiskit_to_tk(circuit))
        return program.to_ir().json(indent=4)

    # Converts an intermediate representation of Braket back into a Circuit
    def ir_to_circuit(self, ir: Program) -> Circuit:
        instructions = ir.instructions
        circuit = Circuit()
        #adding of instructions
        for inst in instructions:
            instcall = getattr(circuit, f"{inst.type}")
            args = []
            kwargs = {}
            # Special cases for kraus and unitary, since they interact with matrices and have special target syntax
            if inst.type == "kraus":
                matrices = inst.matrices.copy()
                reformed_matrices = []
                for matrix in matrices:
                    for row in matrix:
                        for i in range(len(row)):
                            row[i] = np.complex(row[i][0], row[i][1])
                    reformed_matrices.append(np.array(matrix))
                args.append(inst.targets)
                kwargs["matrices"] = reformed_matrices
            elif inst.type == "unitary":
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

                if hasattr(inst, "matrix"):
                    matrix = inst.matrix.copy()
                    for row in matrix:
                        for i in range(len(row)):
                            row[i] = np.complex(row[i][0], row[i][1])
                    kwargs["matrix"] = np.array(matrix)
                    kwargs["targets"] = inst.targets
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

            #Calls function using args and kwargs
            instcall(*args, **kwargs)

        #Get measurement operations from IR
        results = ir.results

        #Adding of resulttypes
        for result in results:
            # Isolated cases for statevector and densitymatrix,
            # since they don't have matching names in both representations
            if(result.type=="statevector"):
                circuit.state_vector()
            elif(result.type=="densitymatrix"):
                circuit.density_matrix(target=result.targets)
            else:
                #Get operation
                instcall = getattr(circuit, f"{result.type}")
                kwargs= {}
                # Adding of parameters to kwargs
                if hasattr(result, "observable"):
                    kwargs["observable"] = Observable(len(result.targets), f"{(str(result.observable[0])).upper()}")
                if hasattr(result, "states"):
                    kwargs["states"] = result.states
                if hasattr(result, "targets"):
                    kwargs["target"] = result.targets

                #Calls function with arguments
                instcall(**kwargs)

        return circuit


if __name__ == "__main__":
    transl = BraketTranslator()
    """ K0 = np.eye(4) * np.sqrt(0.9)
    K1 = np.kron([[1., 0.], [0., 1.]], [[0., 1.], [1., 0.]]) * np.sqrt(0.1)
    print(f"Matrices Original: [{K0}, {K1}")
    h: Circuit = Circuit().cphaseshift(0, 1, 0.15).h(0).iswap(0, 2).rx(0, 0.15).expectation(
        observable=Observable.H(), target=0).density_matrix(target=[0,1])
    print(h)
    prog = h.to_ir()
    trans = BraketTranslator()
    print(trans.ir_to_circuit(prog))"""
    circ = QuantumCircuit(2,1)
    circ.h(0)
    circ.cx(0,1)
    circ.measure(0,0)
    print(transl.to_language(circ))


