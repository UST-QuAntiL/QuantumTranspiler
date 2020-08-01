from pyquil.gates import *
from pyquil.quil import Program
from circuit.qiskit_utility import standard_instructions
from qiskit import QuantumCircuit
import numpy as np
from qiskit.circuit.classicalregister import ClassicalRegister
from qiskit.circuit.library.standard_gates import *
from qiskit.circuit.quantumregister import QuantumRegister

def pyquil_commands_to_program(commands: str) -> QuantumCircuit:
    
    exec(commands)
    val = eval("p")
    return val   

def qiskit_commands_to_circuit(commands: str) -> QuantumCircuit:
    exec(commands)
    val = eval("qc")     
    return val   

def circuit_to_qiskit_commands(circuit: QuantumCircuit):
    commands = ""
    (reg_str, simple_registers) = _handle_regs(circuit)
    commands += reg_str
    commands += _handle_instructions(circuit, simple_registers)
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
            
        if operation.name == "unitary":
            matrix = _create_matrix(params)
            param_str += _create_reg_string(qubits, param_str, simple_registers)
            param_str = f"[{param_str}]"
            commands += f"qc.{operation.name}({matrix} ,{param_str}, label='{operation.label}')\n"  

        else:
            param_str = _create_param_string(params, param_str)
            param_str = _create_reg_string(qubits, param_str, simple_registers)
            param_str = _create_reg_string(clbits, param_str, simple_registers)  

            if operation.name in standard_instructions:
                commands += f"qc.{operation.name}({param_str})\n" 
            else:
                commands += f"gate = {operation.__class__.__name__}({operation.num_ctrl_qubits}, ctrl_state={operation.ctrl_state})\n"
                commands += f"qc.append(gate, qargs=[{param_str}])\n"     
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
    
