import traceback
from cirq.contrib.qasm_import import QasmException
from pennylane import DeviceError
import re
from api.request_schemas import ImportRequestSchema, ImportRequest, ExportRequestSchema, ExportRequest, \
    ConversionRequestSchema, ConversionRequest, UnrollRequestSchema, UnrollRequest, SimulationRequestSchema, \
    SimulationRequest, DepthRequestSchema, DepthRequest
from api.response_schemas import CircuitResponse, \
    DepthResponseSchema, DepthResponse
from examples.qpu_couplings import qpus
from flask import Flask, Response
from flask_cors import CORS
from circuit.circuit_wrapper import CircuitWrapper
from flask_smorest import Api, Blueprint, abort
from api.config import Config
from api.example_circuits import QISKIT_EXAMPLE, QASM_EXAMPLE

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
cors = CORS(app)

blp = Blueprint("api", __name__, url_prefix="/", description="All QuantumTranspiler operations")


@app.route("/")
def heartbeat():
    return '<h1>The QuantumTranspiler is running</h1> <h3>View the API Docs <a href="/api/swagger-ui">here</a></h3>'


@blp.route("/circuit_to_internal", methods=["POST"])
@blp.arguments(
    ImportRequestSchema,
    example={
        "option": "OpenQASM",
        "circuit": QASM_EXAMPLE
    }
)
@blp.response(200, content_type="text/plain")
def circuit_to_internal(data: ImportRequest):
    language = data.get("option")
    circuit = data.get("circuit")
    try:
        wrapper = CircuitWrapper()
        wrapper.import_language(circuit, language)
        output = wrapper.export_qiskit_commands(include_imports=False)
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
    return CircuitResponse(output)


@blp.route("/export_circuit", methods=["POST"])
@blp.arguments(
    ExportRequestSchema,
    example={
        "option": "Cirq-JSON",
        "circuit": QISKIT_EXAMPLE,
    }
)
@blp.response(200, content_type="text/plain")
def export_circuit(data: ExportRequest):
    language = data.get("option")
    circuit = data.get("circuit")
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
    return CircuitResponse(output)


@blp.route("/convert", methods=["POST"])
@blp.arguments(
    ConversionRequestSchema,
    example={
        "option": "OpenQASM",
        "optionOutput": "Cirq-JSON",
        "circuit": QASM_EXAMPLE
    }
)
@blp.response(200, content_type="text/plain")
def convert(data: ConversionRequest):
    language = data.get("option")
    language_output = data.get("output_option")
    circuit = data.get("circuit")
    try:
        wrapper = CircuitWrapper()
        wrapper.import_language(circuit, language)
        traceback.print_exc()
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
        traceback.print_exc()
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
    return CircuitResponse(output)


@blp.route("/unroll", methods=["POST"])
@blp.arguments(
    UnrollRequestSchema,
    example={
        "option": "IBMQ",
        "circuit": QISKIT_EXAMPLE,
        "isExpert": True,
        "format": "Qiskit"
    }
)
@blp.response(200, content_type="text/plain")
def unroll(data: UnrollRequest):
    architecture = data.get("option")
    circuit = data.get("circuit")
    is_custom_export = data.get("is_expert")
    language = data.get("format")

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
    return CircuitResponse(output)


@blp.route("/simulate", methods=["POST"])
@blp.arguments(
    SimulationRequestSchema,
    example={
        "circuit": QISKIT_EXAMPLE
    }
)
@blp.response(
    200,
    example={"01": 250, "10": 750})
def simulate(data: SimulationRequest):
    circuit = data.get("circuit")
    try:
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
        output = wrapper.simulate()
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500
    return output


@blp.route("/depth", methods=["POST"])
@blp.arguments(
    DepthRequestSchema,
    example={
        "circuit": QISKIT_EXAMPLE
    }
)
@blp.response(200, DepthResponseSchema)
def depth(data: DepthRequest):
    circuit = data.get("circuit")
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

    return DepthResponse(output)


@blp.route("/depth_comparison_qpu", methods=["POST"])
@blp.arguments(
    DepthRequestSchema,
    example={
        "circuit": QISKIT_EXAMPLE
    }
)
@blp.response(200, DepthResponseSchema)
def depth_comparison_qpu(data: DepthRequest):
    circuit = data.get("circuit")
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
    return DepthResponse(output)


api.register_blueprint(blp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5012, debug=False)
