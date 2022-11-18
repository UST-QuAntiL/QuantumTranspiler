from conversion.converter.command_utility import (
    create_matrix_params,
    create_param_string,
    create_reg_string,
)
from pyquil import Program
from circuit.qiskit_utility import standard_instructions
from qiskit import QuantumCircuit
import pyquil.quilbase as pyquil_circuit_library
from pyquil.gates import NOP
from cirq import Circuit
from braket.circuits.circuit import Circuit as BRCircuit
from conversion.converter.globals_util import get_custom_builtins


def get_custom_globals():
    custom_builtins = get_custom_builtins()
    custom_globals = globals()
    custom_globals["__builtins__"] = custom_builtins
    return custom_globals


def pyquil_commands_to_program(commands: str) -> Program:
    custom_globals = get_custom_globals()
    exec(commands, custom_globals)
    val = eval("p", custom_globals)
    return val


def braket_commands_to_circuit(commands: str) -> BRCircuit:
    custom_globals = get_custom_globals()
    exec(commands, custom_globals)
    val: BRCircuit = eval("c", custom_globals)
    return val


def cirq_commands_to_circuit(commands: str) -> Circuit:
    custom_globals = get_custom_globals()
    exec(commands, custom_globals)
    val: Circuit = eval("c", custom_globals)
    return val


def qiskit_commands_to_circuit(commands: str) -> QuantumCircuit:
    custom_globals = get_custom_globals()
    exec(commands, custom_globals)
    val = eval("qc", custom_globals)
    return val


def circuit_to_qiskit_commands(circuit: QuantumCircuit, include_imports=True):
    commands = ""
    if include_imports:
        commands = """from qiskit import QuantumCircuit
from qiskit.circuit.classicalregister import ClassicalRegister
from qiskit.circuit.quantumregister import QuantumRegister
from qiskit.circuit.library.standard_gates import *\n\n"""

    (reg_str, simple_registers) = _handle_regs(circuit)
    commands += reg_str
    commands += _handle_instructions(circuit, simple_registers)
    return commands


def circuit_to_pyquil_commands(program: Program):
    commands = """from pyquil import Program, get_qc
from pyquil.gates import *
import numpy as np
p = Program()\n\n"""

    for instr in program.instructions:
        if isinstance(instr, pyquil_circuit_library.Declare):
            if instr.memory_type != "BIT":
                raise NotImplementedError(
                    "Unsupported memory type:" + str(instr.memory_type)
                )

            commands += f"{instr.name} = p.declare('{instr.name}', 'BIT', {instr.memory_size})\n"

        elif isinstance(instr, pyquil_circuit_library.Gate):
            name = instr.name
            params = instr.params
            qubits = instr.qubits

            if "CONTROLLED" in instr.modifiers:
                control_qubits = [qubits[0]]
                qubits.pop(0)

            param_str = create_param_string(params)
            param_str = create_param_string(qubits, param_str)

            commands += f"p += {name}({param_str})"
            if "CONTROLLED" in instr.modifiers:
                commands += f".controlled({create_param_string(control_qubits)})"
            commands += "\n"

        elif isinstance(instr, pyquil_circuit_library.Measurement):
            commands += f"p += MEASURE({instr.qubit.index}, {instr.classical_reg.name}[{instr.classical_reg.offset}])\n"

        elif isinstance(instr, pyquil_circuit_library.Pragma):
            continue
        elif isinstance(instr, NOP):
            continue
        elif isinstance(instr, pyquil_circuit_library.Halt):
            break
        else:
            raise NotImplementedError("Unsupported instruction: " + str(instr))

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
            matrix = create_matrix_params(params)
            param_str += create_reg_string(qubits, param_str, simple_registers)
            param_str = f"[{param_str}]"
            commands += f"qc.{operation.name}({matrix} ,{param_str}, label='{operation.label}')\n"

        else:
            if operation.name in standard_instructions:
                param_str = create_param_string(params, param_str)
                param_str = create_reg_string(qubits, param_str, simple_registers)
                param_str = create_reg_string(clbits, param_str, simple_registers)
                commands += f"qc.{operation.name}({param_str})\n"
            # non standard non unitary gates
            else:
                param_str = create_param_string(params, param_str)
                command = (
                    f"qc.{operation.name}({param_str}, {operation.num_ctrl_qubits}"
                )
                # check if default ctrl_state (default one must not be specified, because some gates like MCU1Gate dont support it)
                if hasattr(operation, "ctrl_state") and (
                    (2 ^ operation.num_ctrl_qubits - 1) != operation.ctrl_state
                ):
                    if param_str != "":
                        command += ", "
                    command += f"ctrl_state={operation.ctrl_state})"
                else:
                    command += ")"
                qargs_str = ""
                qargs_str = create_reg_string(qubits, qargs_str, simple_registers)
                qargs_str = create_reg_string(clbits, qargs_str, simple_registers)
                commands += command + "\n"
                commands += f"qc.append(gate, qargs=[{qargs_str}])\n"
    return commands
