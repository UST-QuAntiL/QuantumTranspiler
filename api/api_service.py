import traceback
from cirq.contrib.qasm_import import QasmException
from pennylane import DeviceError
import re
from examples.qpu_couplings import qpus
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from circuit.circuit_wrapper import CircuitWrapper

app = Flask(__name__)
cors = CORS(app)


@app.route('/circuit_to_internal', methods=['Post'])
def circuit_to_internal():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper()
        if option.lower() == "quil":
            wrapper.import_quil(circuit)
        elif option.lower() == "pyquil":
            wrapper.import_pyquil(circuit)
        elif option.lower() == "openqasm":
            wrapper.import_qasm(circuit)
        elif option.lower() == "qiskit":
            wrapper.import_qiskit(circuit)
        elif option.lower() == "cirq":
            wrapper.import_cirq_json(circuit)
        elif option.lower() == "cirqsdk":
            wrapper.import_cirq(circuit)
        elif option.lower() == "braket":
            wrapper.import_braket_ir(circuit)
        elif option.lower() == "braketsdk":
            wrapper.import_braket(circuit)
        elif option.lower() == "qsharp":
            wrapper.import_qsharp(circuit)
        elif option.lower() == "quirk":
            wrapper.import_quirk(circuit)
        else:
            return "Bad Request!", 400
        output = wrapper.export_qiskit_commands()
    except DeviceError as de:
        gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(de))[0]
        return f"Importing {option} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Importing {option} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(nie))[0]
        return f"Importing {option} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r'(line \d+)', str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while importing {option}: {str(e)}", 500
    return output


@app.route('/export_circuit', methods=['Post'])
def export_circuit():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit) 
        if option.lower() == "quil":
            output = wrapper.export_quil()
        elif option.lower() == "pyquil":
            output = wrapper.export_pyquil()
        elif option.lower() == "openqasm":
            output = wrapper.export_qasm()
        elif option.lower() == "qiskit":
            output = wrapper.export_qiskit_commands()
        elif option.lower() == "cirq":
            output = wrapper.export_cirq_json()
        elif option.lower() == "braket":
            output = wrapper.export_braket_ir()
        elif option.lower() == "qsharp":
            output = wrapper.export_qsharp()
        elif option.lower() == "quirk":
            output = wrapper.export_quirk()
        else:
            return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(de))[0]
        return f"Exporting {option} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Exporting {option} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(nie))[0]
        return f"Exporting {option} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r'(line \d+)', str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while exporting {option}: {str(e)}", 500
    return output

@app.route('/convert', methods=['Post'])
def convert():
    data = request.json
    option = data["option"]
    option_output = data["optionOutput"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper()
        if option.lower() == "quil":
            wrapper.import_quil(circuit)
        elif option.lower() == "pyquil":
            wrapper.import_pyquil(circuit)
        elif option.lower() == "openqasm":
            wrapper.import_qasm(circuit)
        elif option.lower() == "qiskit":
            wrapper.import_qiskit(circuit)
        elif option.lower() == "cirq":
            wrapper.import_cirq_json(circuit)
        elif option.lower() == "cirqsdk":
            wrapper.import_cirq(circuit)
        elif option.lower() == "braket":
            wrapper.import_braket_ir(circuit)
        elif option.lower() == "braketsdk":
            wrapper.import_braket(circuit)
        elif option.lower() == "qsharp":
            wrapper.import_qsharp(circuit)
        elif option.lower() == "quirk":
            wrapper.import_quirk(circuit)
        else:
            return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(de))[0]
        return f"Converting from {option} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Converting from {option} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(nie))[0]
        return f"Converting from {option} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r'(line \d+)', str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while converting from {option}: {str(e)}", 500

    try:
        if option_output.lower() == "quil":
            output = wrapper.export_quil()
        elif option_output.lower() == "pyquil":
            output = wrapper.export_pyquil_commands()
        elif option_output.lower() == "openqasm":
            output = wrapper.export_qasm()
        elif option_output.lower() == "qiskit":
            output = wrapper.export_qiskit_commands(include_imports=True)
        elif option_output.lower() == "cirq" or option_output.lower() == "cirq-json":
            output = wrapper.export_cirq_json()
        elif option_output.lower() == "braket":
            output = wrapper.export_braket_ir()
        elif option_output.lower() == "qsharp":
            output = wrapper.export_qsharp()
        elif option_output.lower() == "quirk":
            output = wrapper.export_quirk()
        else:
            return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(de))[0]
        return f"Converting to {option_output} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Converting to {option_output} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(nie))[0]
        return f"Converting to {option_output} does not support '{gate}' gates", 500
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while converting to {option_output}: {str(e)}", 500

    return output

@app.route('/unroll', methods=['Post'])
def unroll():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    isExpert = data["isExpert"]
    format = data["format"]

    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        if option == "Rigetti":
            wrapper.unroll_rigetti()
        elif option == "IBMQ":
            wrapper.unroll_ibm()
        elif option == "Sycamore":
            wrapper.unroll_sycamore()
        else:
            return "Bad Request!", 400

        if isExpert:
            if format.lower() == "quil":
                output = wrapper.export_quil()
            elif format.lower() == "pyquil":
                output = wrapper.export_pyquil()
            elif format.lower() == "openqasm":
                output = wrapper.export_qasm()
            elif format.lower() == "qiskit":
                output = wrapper.export_qiskit_commands()
            elif format.lower() == "cirq":
                output = wrapper.export_cirq_json()
            elif format.lower() == "braket":
                output = wrapper.export_braket_ir()
            elif format.lower() == "qsharp":
                output = wrapper.export_qsharp()
            elif format.lower() == "quirk":
                output = wrapper.export_quirk()
            else:
                return "Bad Request!", 400
        else:
            if option == "Rigetti":
                output = wrapper.export_quil()
            elif option == "IBMQ":
                output = wrapper.export_qasm()
            elif option == "Syncamore":
                output = wrapper.export_cirq_json()
            else:
                return "Bad Request!", 400

    except DeviceError as de:

        gate = re.findall(r'(?:Gate )(.*?)(?: not)', str(de))[0]

        return f"Exporting {option} does not support '{gate}' gates", 500

    except QasmException as qe:

        gate = re.findall(r'"(.*?)"', qe.message)[0]

        return f"Exporting {option} does not support '{gate}' gates", 500

    except NotImplementedError as nie:

        gate = re.findall(r'(?:convert )(.*?)(?: |\()', str(nie))[0]

        return f"Exporting {option} does not support '{gate}' gates", 500

    except SyntaxError as se:

        line = re.findall(r'(line \d+)', str(se))[0]

        return f"Invalid syntax of input in line {line}"

    except Exception as e:

        traceback.print_exc()

        print(str(e))

        return f"General error while exporting {option}: {str(e)}", 500
    return output


@app.route('/simulate', methods=['Post'])
def simulate():
    data = request.json
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        output = wrapper.simulate()
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500
    return output

@app.route('/depth', methods=['Post'])
def depth():
    data = request.json
    circuit = data["circuit"]
    depth = {}
    try:        
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        wrapper.unroll_ibm()
        depth["q_depth"] = wrapper.depth()
        depth["q_two_qubit"] = wrapper.depth_two_qubit_gates()
        depth["q_gate_times"] = wrapper.depth_gate_times()
    except Exception as e:
        traceback.print_exc()
        depth["q_depth"] = -1
        depth["q_two_qubit"] = -1
        depth["q_gate_times"] = -1
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        wrapper.unroll_rigetti()
        depth["r_depth"] = wrapper.depth()
        depth["r_two_qubit"] = wrapper.depth_two_qubit_gates()
        depth["r_gate_times"] = wrapper.depth_gate_times()
    except Exception as e:
        depth["r_depth"] = wrapper.depth()
        depth["r_two_qubit"] = wrapper.depth_two_qubit_gates()
        depth["r_gate_times"] = wrapper.depth_gate_times()
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        wrapper.unroll_sycamore()
        depth["s_depth"] = wrapper.depth()
        depth["s_two_qubit"] = wrapper.depth_two_qubit_gates()
        depth["s_gate_times"] = -1
    except Exception as e:
        depth["s_depth"] = -1
        depth["s_two_qubit"] = -1
        depth["s_gate_times"] = -1
    output = depth

    return output


@app.route('/depth_comparison_qpu', methods=['Post'])
def depth_comparison_qpu():
    data = request.json
    circuit = data["circuit"]
    depth = {}
    try: 
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        circuit = wrapper.circuit
        qpu_map = qpus()
        for qpu_name in qpu_map:      
            wrapper = CircuitWrapper(qiskit_circuit=circuit)      
            is_ibm = False
            qpu = qpu_map[qpu_name]
            if qpu[1] == "q":
                is_ibm = True
            qpu_multiplier = qpu[1]
            qpu_coupling = qpu[2]
            if len(wrapper.dag.qubits) > len(qpu_coupling.physical_qubits):
                continue
            if is_ibm:
                wrapper.unroll_ibm()
                depth["q_depth"] = wrapper.depth() * qpu_multiplier
                depth["q_two_qubit"] = wrapper.depth_two_qubit_gates() * qpu_multiplier
                depth["q_gate_times"] = wrapper.depth_gate_times() * qpu_multiplier
            
            else:

                wrapper.unroll_rigetti()
                depth["r_depth"] = wrapper.depth()
                depth["r_two_qubit"] = wrapper.depth_two_qubit_gates()
                depth["r_gate_times"] = wrapper.depth_gate_times()
        output = depth
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500
    return output


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port=5012, debug=False)
