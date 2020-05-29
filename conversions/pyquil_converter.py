from qiskit import QuantumCircuit, QuantumRegister
from pyquil import Program
from qiskit_utility import show_figure
class PyquilConverter:
    @staticmethod
    def import_quil(quil: str) -> QuantumCircuit:
        program = Program(quil)
        return PyquilConverter.import_pyquil(program)

    @staticmethod
    def import_pyquil(program: Program) -> QuantumCircuit:  
        # check if qubit set is from 0 to len(set) 
        qubit_set = program.get_qubits()        
        all_qubits = True
        for i in range(0, len(qubit_set)):            
            if not (i in qubit_set):
                all_qubits = False
                break

        q = []
        qreg_mapping = {}
        creg_mapping = {}
        if all_qubits:
            q.append(QuantumRegister(len(qubit_set), "q"))
        else:            
            for i in qubit_set:
                qr = QuantumRegister(1, "q" + str(i))
                q.append(qr)
                qreg_mapping[i] = qr

        # *q converts list to single parameters
        circuit = QuantumCircuit(*q)
        
        for inst in program.instructions:
            if isinstance(inst, Gate):
                if inst.name in quil_gates:
                    operation = 
                    circuit += 
                try:
                    optype = _known_quil_gate[i.name]
                except KeyError as error:
                    raise NotImplementedError(
                        "Operation not supported by tket: " + str(i)
                    ) from error
                qubits = [qmap[q.index] for q in i.qubits]
                params = [p / pi for p in i.params]
                tkc.add_gate(optype, params, qubits)
            # elif isinstance(i, Measurement):
            #     qubit = qmap[i.qubit.index]
            #     reg = cregmap[i.classical_reg.name]
            #     bit = reg[i.classical_reg.offset]
            #     tkc.Measure(qubit, bit)
            # elif isinstance(i, Declare):
            #     if i.memory_type != "BIT":
            #         raise NotImplementedError(
            #             "Cannot handle memory of type " + i.memory_type
            #         )
            #     new_reg = tkc.add_c_register(i.name, i.memory_size)
            #     cregmap.update({i.name: new_reg})
            # elif isinstance(i, Pragma):
            #     continue
            # elif isinstance(i, Halt):
            #     return tkc
            # else:
            #     raise NotImplementedError("PyQuil instruction is not a gate: " + str(i))

        show_figure(circuit)
        return
