from qiskit import QuantumCircuit
import numpy as np

def commands_to_circuit(commands: str) -> QuantumCircuit:
    exec(commands)
    val = eval("qc")     
    return val   

def circuit_to_commands(circuit: QuantumCircuit):
    commands = ""
    (reg_str, simple_registers) = _handle_regs(circuit)
    commands += reg_str
    commands += _handle_instructions(circuit, simple_registers)

    # print(commands)
    return commands

def _handle_regs(circuit: QuantumCircuit):
    commands = ""
    simple_registers = False

    qregs = circuit.qregs
    cregs = circuit.cregs
    if len(qregs) == 1 and len(cregs) == 1:
        simple_registers = True
        commands += f"qc = QuantumCircuit({qregs[0].size},{cregs[0].size})\n"
    elif len(qregs) == 1 and len(cregs) == 0: 
        simple_registers = True        
        commands += f"qc = QuantumCircuit({qregs[0].size})\n"
    else:
        regs_string = ""  
        for qreg in qregs:   
            commands += f"{qreg.name} = QuantumRegister({qreg.size}, '{qreg.name}')\n"
            if regs_string != "":
                regs_string += ","   
            regs_string += f"{qreg.name}"      
        for creg in cregs: 
            commands += f"{creg.name} = ClassicalRegister({creg.size}, '{creg.name}')\n"   
            if regs_string != "":
                regs_string += ","   
            regs_string += f"{creg.name}"  
        commands += f"qc = QuantumCircuit({regs_string})\n"
    return commands, simple_registers


def _handle_instructions(circuit, simple_registers):    
    commands = ""
    for instr in circuit.data:
        operation = instr[0]
        params = operation.params
        qubits = instr[1]
        clbits = instr[2]        
        param_str = ""

        # if operation.name == "barrier":
        #     print(operation)
        #     param_str += _create_reg_string(qubits, param_str, simple_registers)
            
        if operation.name == "unitary":
            matrix = _create_matrix(params)
            param_str += _create_reg_string(qubits, param_str, simple_registers)
            param_str = f"[{param_str}]"
            commands += f"qc.{operation.name}({matrix} ,{param_str}, label='{operation.label}')\n"  

        else:
            param_str = _create_param_string(params, param_str)
            param_str = _create_reg_string(qubits, param_str, simple_registers)
            param_str = _create_reg_string(clbits, param_str, simple_registers)  
            commands += f"qc.{operation.name}({param_str})\n"   
    return commands

def _create_param_string(params, param_str):
    param = ""
    for param in params:            
        if param_str != "":
            param_str += ", "
    param_str += f"{param}"
    return param_str

def _create_reg_string(regs, param_str, simple_registers):
    for bit in regs:
        if param_str != "":
            param_str += ", "
        if simple_registers:
            param_str += f"{bit.index}" 
        else:
            param_str += f"{bit.register.name}[{bit.index}]"            
    return param_str

def _create_matrix(params):
    params = params[0]
    matrix_str = f"np.{repr(params)}"
    return matrix_str


    # qiskit_gate = instr[0]
    #         qubits = [qreg_mapping[qubit] for qubit in instr[1]]

    #         if isinstance(qiskit_gate, qiskit_circuit_library.Gate):
    #             # usual gates
    #             self._handle_gate_export(converter, qiskit_gate, qubits)

    #         elif isinstance(instr[0], qiskit_circuit_library.Barrier):
    #             converter.barrier()
    #         elif isinstance(instr[0], qiskit_circuit_library.Measure):
    #             qubit = qreg_mapping[instr[1][0]]
    #             clbit = creg_mapping[instr[2][0]]
    #             converter.measure(qubit, clbit)

    #         elif isinstance(instr[0], qiskit_circuit_library.Instruction):
    #             # for sub circuits: recursively build circuit
    #             clbits = [creg_mapping[clbit] for clbit in instr[2]]
    #             subcircuit = self.export_circuit(
    #                 instr[0].decompositions[0], recursive=True)[0]
    #             converter.subcircuit(subcircuit, qubits, clbits)

    #         else:
    #             raise NotImplementedError(
    #                 "Unsupported Instruction: " + str(instr))

    #     return (converter.circuit, qreg_mapping, creg_mapping)

    # def _handle_gate_export(self, converter, qiskit_gate, qubits) -> None:
    #     # needed for controlled modifier
    #     is_controlled = False
    #     num_qubits_base_gate = None

    #     qiskit_gate_class_name = qiskit_gate.__class__.__name__  

    #     # if converter is control_capable controlled gates can be represented by using the native control modifier/method
    #     if (converter.is_control_capable):
    #         # if 1:1 translation for the gate exists, use the 1:1 translation and do not use the controlled modifier/method
    #         if not self._in_mappings(converter, qiskit_gate_class_name, "g"):
    #             # check for controlled gates --> can be handled with controlled modifier/method
    #             if (isinstance(qiskit_gate, ControlledGate) and qiskit_gate.base_gate):
    #                 base_gate = qiskit_gate.base_gate
    #                 num_qubits_base_gate = base_gate.num_qubits
    #                 qiskit_gate_class_name = base_gate.__class__.__name__
    #                 # check if base gate has gate entry in gate_mappings (otherwise controlled standard_gate construction is not possible)
    #                 if (converter.name in gate_mapping_qiskit[qiskit_gate_class_name] and gate_mapping_qiskit[qiskit_gate_class_name][converter.name] and "g" in gate_mapping_qiskit[qiskit_gate_class_name][converter.name]):
    #                     qiskit_gate_class_name = base_gate.__class__.__name__
    #                     is_controlled = True

    #     if qiskit_gate_class_name in gate_mapping_qiskit:
    #         params = qiskit_gate.params
    #         # parameter conversion
    #         for i, param in enumerate(params):
    #             # parameterized circuit --> add Pyquil Parameter Object (convert from Qiskit Parameter Object)
    #             if isinstance(param, qiskit_Parameter_expression):
    #                 params[i] = converter.parameter_expression_conversion(param)
    #             if isinstance(param, qiskit_Parameter):
    #                 params[i] = converter.parameter_conversion(param)

    #         # check if gate/replacement program is defined (else the corresponding matrix might be used)
    #         if self._in_mappings(converter, qiskit_gate_class_name, "g"):
    #             gate = self._get_gate(converter, qiskit_gate_class_name, "g")
    #             converter.gate(gate, qubits, params, is_controlled=is_controlled,
    #                             num_qubits_base_gate=num_qubits_base_gate)
    #             return

    #         # replacement defined (no 1:1 gate available)
    #         # in this case gate is a circuit generating function defined in name_replacement
    #         if self._in_mappings(converter, qiskit_gate_class_name, "r"):
    #             replacement_function = self._get_gate(converter, qiskit_gate_class_name, "r")
    #             replacement_circuit = replacement_function(*params)
    #             converter.subcircuit(replacement_circuit, qubits)
    #             return

    #         # matrix is defined in gate mappings
    #         if "matrix" in gate_mapping_qiskit[qiskit_gate_class_name]:
    #             matrix = gate_mapping_qiskit[qiskit_gate_class_name]["matrix"]
    #             name = qiskit_gate_class_name
    #             gate = converter.custom_gate(matrix, name, qubits, params)
    #             return

    #     # gate not found in gate mappings, check if gate is defined by a matrix 
    #     try:
    #         matrix = qiskit_gate.to_matrix()
    #         # get name (construction is the same as qiskit's in the qasm method)
    #         name = qiskit_gate.label if qiskit_gate.label else "unitary" + \
    #             str(id(qiskit_gate))
    #         gate = converter.custom_gate(matrix, name, qubits)
    #     except CircuitError:
    #         raise NotImplementedError("Unsupported Gate: " + str(gate))
