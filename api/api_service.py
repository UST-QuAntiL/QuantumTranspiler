import traceback
from cirq.contrib.qasm_import import QasmException
from pennylane import DeviceError
import re
from examples.qpu_couplings import qpus
from flask import Flask
from flask import request
from flask_cors import CORS
from circuit.circuit_wrapper import CircuitWrapper

app = Flask(__name__)
cors = CORS(app)


@app.route("/circuit_to_internal", methods=["Post"])
def circuit_to_internal():
    data = request.json
    language = data["option"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper()
        wrapper.import_language(circuit, language)
        output = wrapper.export_qiskit_commands()
    except ValueError:
        return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r"(?:Gate )(.*?)(?: not)", str(de))[0]
        return f"Importing {language} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Importing {language} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r"(?:convert )(.*?)(?: |\()", str(nie))[0]
        return f"Importing {language} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r"(line \d+)", str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while importing {language}: {str(e)}", 500
    return output


@app.route("/export_circuit", methods=["Post"])
def export_circuit():
    data = request.json
    language = data["option"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        output = wrapper.export_language(language)
    except ValueError:
        return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r"(?:Gate )(.*?)(?: not)", str(de))[0]
        return f"Exporting {language} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Exporting {language} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r"(?:convert )(.*?)(?: |\()", str(nie))[0]
        return f"Exporting {language} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r"(line \d+)", str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while exporting {language}: {str(e)}", 500
    return output


@app.route("/convert", methods=["Post"])
def convert():
    data = request.json
    language = data["option"]
    language_output = data["optionOutput"]
    circuit = data["circuit"]
    try:
        wrapper = CircuitWrapper()
        wrapper.import_language(circuit, language)
    except ValueError:
        return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r"(?:Gate )(.*?)(?: not)", str(de))[0]
        return f"Converting from {language} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Converting from {language} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r"(?:convert )(.*?)(?: |\()", str(nie))[0]
        return f"Converting from {language} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r"(line \d+)", str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while converting from {language}: {str(e)}", 500

    try:
        output = wrapper.export_language(language_output)
    except ValueError:
        return "Bad Request!", 400
    except DeviceError as de:
        gate = re.findall(r"(?:Gate )(.*?)(?: not)", str(de))[0]
        return f"Converting to {language_output} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Converting to {language_output} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r"(?:convert )(.*?)(?: |\()", str(nie))[0]
        return f"Converting to {language_output} does not support '{gate}' gates", 500
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while converting to {language_output}: {str(e)}", 500
    return output


@app.route("/unroll", methods=["Post"])
def unroll():
    data = request.json
    architecture = data["option"]
    circuit = data["circuit"]
    is_custom_export = data["isExpert"]
    language = data["format"]

    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        if architecture == "Rigetti":
            wrapper.unroll_rigetti()
        elif architecture == "IBMQ":
            wrapper.unroll_ibm()
        elif architecture == "Sycamore":
            wrapper.unroll_sycamore()
        else:
            return "Bad Request!", 400

        if is_custom_export:
            try:
                output = wrapper.export_language(language)
            except ValueError:
                return "Bad Request!", 400

        else:
            if architecture == "Rigetti":
                output = wrapper.export_quil()
            elif architecture == "IBMQ":
                output = wrapper.export_qasm()
            elif architecture == "Syncamore":
                output = wrapper.export_cirq_json()
            else:
                return "Bad Request!", 400

    except DeviceError as de:
        gate = re.findall(r"(?:Gate )(.*?)(?: not)", str(de))[0]
        return f"Exporting {architecture} does not support '{gate}' gates", 500
    except QasmException as qe:
        gate = re.findall(r'"(.*?)"', qe.message)[0]
        return f"Exporting {architecture} does not support '{gate}' gates", 500
    except NotImplementedError as nie:
        gate = re.findall(r"(?:convert )(.*?)(?: |\()", str(nie))[0]
        return f"Exporting {architecture} does not support '{gate}' gates", 500
    except SyntaxError as se:
        line = re.findall(r"(line \d+)", str(se))[0]
        return f"Invalid syntax of input in line {line}"
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return f"General error while exporting {architecture}: {str(e)}", 500
    return output


@app.route("/simulate", methods=["Post"])
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


@app.route("/depth", methods=["Post"])
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


@app.route("/depth_comparison_qpu", methods=["Post"])
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5012, debug=False)
