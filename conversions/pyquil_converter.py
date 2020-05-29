from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from pyquil import Program
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from qiskit_utility import show_figure
from gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate


class PyquilConverter:
    @staticmethod
    def import_quil(quil: str) -> QuantumCircuit:
        program = Program(quil)
        return PyquilConverter.import_pyquil(program)

    @staticmethod
    def import_pyquil(program: Program) -> QuantumCircuit:
        # check if qubit set is from 0 to len(set)
        qubit_set = program.get_qubits()
        qreg_mapping = {}
        creg_mapping = {}
        # all_qubits = False
        # for i in range(0, len(qubit_set)):
        #     if not (i in qubit_set):
        #         all_qubits = False
        #         break
        # q = []
        # if all_qubits:
        #     q.append(QuantumRegister(len(qubit_set), "q"))
        # else:
        #     for i in qubit_set:
        #         qr = QuantumRegister(1, "q" + str(i))
        #         q.append(qr)
        #         qreg_mapping[i] = qr
        # # *q converts list to single parameters
        # circuit = QuantumCircuit(*q)

        qr = QuantumRegister(len(qubit_set), "q")
        for counter, qubit in enumerate(qubit_set):
            qreg_mapping[qubit] = counter
        circuit = QuantumCircuit(qr)

        for inst in program.instructions:
            if isinstance(inst, Declare):
                if inst.memory_type != "BIT":
                    raise NotImplementedError(
                        "Unsupported memory type:" + inst.memory_type
                    )
                cr = ClassicalRegister(inst.memory_size, inst.name)
                creg_mapping[inst.name] = cr
                circuit.add_register(cr)

            elif isinstance(inst, Gate):
                if (inst.name in gate_mapping_pyquil) or (isinstance(inst, DefGate)):
                    if (inst.name in gate_mapping_pyquil):
                        # get the instruction
                        inst_qiskit_class = gate_mapping_pyquil[inst.name]
                        # TODO check if division by pi is necessary (pytket does this)
                        params = inst.params
                        inst_qiskit = inst_qiskit_class(*params)
                    else:
                        inst_qiskit = UnitaryGate(inst.matrix)
                    # get the qubits on which the instruction operates
                    qubits = [qreg_mapping[qubit.index] for qubit in inst.qubits]
                    qargs = [qr[qubit] for qubit in qubits]
                    circuit.append(inst_qiskit, qargs=qargs)
                
                else:
                    raise NotImplementedError("Gate " + str(inst) + " is not supported.")
        
            elif isinstance(inst, Measurement):
                qubit = qr[qreg_mapping[inst.qubit.index]]
                print(qubit)
                creg = creg_mapping[inst.classical_reg.name]
                print(creg)
                bit = creg[inst.classical_reg.offset]
                circuit.measure(qubit, bit)

           
            # elif isinstance(i, Pragma):
            #     continue
            # elif isinstance(i, Halt):
            #     return tkc
            # else:
            #     raise NotImplementedError("PyQuil instruction is not a gate: " + str(i))

        show_figure(circuit)
        return
