from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from pyquil import Program
from pyquil.quilbase import Declare, Gate, Halt, Measurement, Pragma, DefGate
from circuit.qiskit_utility import show_figure
from conversion.gate_mappings import gate_mapping_qiskit, gate_mapping_pyquil
from qiskit.extensions import UnitaryGate
from qiskit.circuit import Qubit, Clbit


class PyquilConverter:
    @staticmethod
    def import_quil(quil: str) -> QuantumCircuit:
        program = Program(quil)
        return PyquilConverter.import_pyquil(program)

    @staticmethod
    def import_pyquil(program: Program) -> (QuantumCircuit, {int: Qubit}, {str: Clbit}):
        qubit_set = program.get_qubits()
        qreg_mapping = {}
        creg_mapping = {}        

        qr = QuantumRegister(len(qubit_set), "q")
        for counter, qubit in enumerate(qubit_set):
            qreg_mapping[qubit] = qr[counter]
        circuit = QuantumCircuit(qr)

        for instr in program.instructions:
            if isinstance(instr, Declare):
                if instr.memory_type != "BIT":
                    raise NotImplementedError(
                        "Unsupported memory type:" + str(instr.memory_type))

                cr = ClassicalRegister(instr.memory_size, instr.name)
                for i in range(instr.memory_size):
                    creg_mapping[instr.name + "_" + str(i)] = cr[i]
                circuit.add_register(cr)

            elif isinstance(instr, Gate):
                PyquilConverter._handle_gate(circuit, instr, qreg_mapping, creg_mapping)

            elif isinstance(instr, Measurement):
                qubit = qreg_mapping[instr.qubit.index]
                clbit = creg_mapping[instr.classical_reg.name + "_" + str(instr.classical_reg.offset)]
                circuit.measure(qubit, clbit)

            elif isinstance(instr, Pragma):
                # http://docs.rigetti.com/en/stable/basics.html#pragmas
                # pragmas do not change the semantics of a program
                # e.g. rewiring and delays
                # can be alternatively implemented with qiskit (https://qiskit.org/documentation/stubs/qiskit.pulse.Delay.html)
                continue
            elif isinstance(instr, Halt):
                break
            else:
                raise NotImplementedError(
                    "Unsupported instruction: " + str(instr))

        show_figure(circuit)
        return (circuit, qreg_mapping, creg_mapping)

    @staticmethod
    def _handle_gate(circuit, instr, qreg_mapping, creg_mapping) -> None:        
        if (instr.name in gate_mapping_pyquil) or (isinstance(instr, DefGate)):
            if (instr.name in gate_mapping_pyquil):
                # get the instruction
                instr_qiskit_class = gate_mapping_pyquil[instr.name]
                # TODO check if division by pi is necessary (pytket does this)
                params = instr.params
                instr_qiskit = instr_qiskit_class(*params)
            else:
                instr_qiskit = UnitaryGate(instr.matrix)
            # get the qubits on which the instruction operates
            qargs = [qreg_mapping[qubit.index]
                        for qubit in instr.qubits]
            circuit.append(instr_qiskit, qargs=qargs)

        else:
            raise NotImplementedError("Unsupported Gate: " + str(instr))
