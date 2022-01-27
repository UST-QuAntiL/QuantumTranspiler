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

class BraketTranslator(Translator):
    name= TranslatorNames.BRAKET

    def from_language(self, text: str) -> QuantumCircuit:
        program = Program.parse_raw(text)
        return tk_to_qiskit(braket_to_tk(self.ir_to_circuit(program)))


    def to_language(self, circuit: QuantumCircuit) -> str:
        program: Circuit = tk_to_braket(qiskit_to_tk(circuit))
        return program.to_ir().json()

    # Converts an intermediate representation of Braket back into a Circuit
    def ir_to_circuit(self, ir: Program) -> Circuit:
        instructions = ir.instructions
        circuit = Circuit()
        #adding of instructions
        for inst in instructions:
            instcall = getattr(circuit, f"{inst.type}")
            command = "instcall("
            if inst.type == "kraus":
                matrices = inst.matrices.copy()
                for matrix in matrices:
                    for row in matrix:
                        for i in range(len(row)):
                            row[i] = np.complex(row[i][0], row[i][1])
                command += f"{inst.targets}, ["
                for matrix in matrices:
                    command += f"np.array({matrix}), "
                command = command[:len(command) - 2] + "])"
            else:
                #Adding of parameters
                if hasattr(inst, "control"):
                    command += f"{str(inst.control)}, "
                elif hasattr(inst, "controls"):
                    for control in inst.controls:
                        command += f"{str(control)}, "

                if hasattr(inst, "target"):
                    command += f"{inst.target}, "
                elif hasattr(inst, "targets"):
                    for target in inst.targets:
                        command += f"{str(target)}, "

                if hasattr(inst, "angle"):
                    command += f"{str(inst.angle)}, "

                if hasattr(inst, "probability"):
                    command += f"probability={str(inst.probability)}, "

                if hasattr(inst, "gamma"):
                    command += f"gamma={str(inst.gamma)}, "

                if hasattr(inst, "matrix"):
                    command += f"matrix={str(inst.matrix)}, "

                if hasattr(inst, "matrices"):
                    command += f"matrices={str(inst.matrices)}, "

                command = command[:len(command)-2] + ")"

            exec(command)


        results = ir.results

        #Adding of resulttypes
        for result in results:
            if(result.type=="statevector"):
                circuit.state_vector()
            else:
                instcall = getattr(circuit, f"{result.type}")
                command = "instcall("
                # Adding of parameters
                if hasattr(result, "observable"):
                    command += f"observable=Observable.{(str(result.observable[0])).upper()}(), "
                if hasattr(result, "states"):
                    command += f"state={result.states}, "
                if hasattr(result, "targets"):
                    command += f"target={result.targets}, "

                command = command[:len(command) - 2] + ")"

                exec(command)
                
            
        return circuit


