import traceback

from examples.qpu_couplings import qpus
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from circuit.circuit_wrapper import CircuitWrapper
from translation.translation_handler import TranslationHandler
import json
import sys
import os

app = Flask(__name__)
cors = CORS(app)
thandler = TranslationHandler()


@app.route('/circuit_to_internal', methods=['Post'])
def circuit_to_internal():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    try:
        if option.lower() == "quil":
            wrapper = CircuitWrapper(quil_str=circuit)
        elif option.lower() == "pyquil":
            wrapper = CircuitWrapper(pyquil_instructions=circuit)
        elif option.lower() == "openqasm":
            wrapper = CircuitWrapper(qasm=circuit)
        elif option.lower() == "qiskit":
            wrapper = CircuitWrapper(qiskit_instructions=circuit)
        elif option.lower() == "cirq":
            wrapper = CircuitWrapper(cirq_str=circuit)
        elif option.lower() == "braket":
            wrapper = CircuitWrapper(braket_str=circuit)
        elif option.lower() == "qsharp":
            wrapper = CircuitWrapper(qsharp_instructions=circuit)
        elif option.lower() == "quirk":
            wrapper = CircuitWrapper(quirk_url=circuit)
        else:
            return "Bad Request!", 400
        output = wrapper.export_qiskit_commands()    
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500    
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
        elif option.lower == "quirk":
            output = wrapper.export_quirk()
        else:
            return "Bad Request!", 400
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500
    return output

@app.route('/convert', methods=['Post'])
def convert():
    data = request.json
    option = data["option"]
    option_output = data["optionOutput"]
    circuit = data["circuit"]
    try:
        if option.lower() == "quil":
            wrapper = CircuitWrapper(quil_str=circuit)
        elif option.lower() == "pyquil":
            wrapper = CircuitWrapper(pyquil_instructions=circuit)
        elif option.lower() == "openqasm":
            wrapper = CircuitWrapper(qasm=circuit)
        elif option.lower() == "qiskit":
            wrapper = CircuitWrapper(qiskit_instructions=circuit)
        elif option.lower() == "cirq":
            wrapper = CircuitWrapper(cirq_str=circuit)
        elif option.lower() == "cirqsdk":
            wrapper = CircuitWrapper(cirq_instructions=circuit)
        elif option.lower() == "braket":
            wrapper = CircuitWrapper(braket_str=circuit)
        elif option.lower() == "braketsdk":
            wrapper = CircuitWrapper(braket_instructions=circuit)
        elif option.lower() == "qsharp":
            wrapper = CircuitWrapper(qsharp_instructions=circuit)
        elif option.lower() == "quirk":
            wrapper = CircuitWrapper(quirk_url=circuit)
        else:
            return "Bad Request!", 400

        if option_output.lower() == "quil":
            output = wrapper.export_quil()
        elif option_output.lower() == "pyquil":
            output = wrapper.export_pyquil_commands()
        elif option_output.lower() == "openqasm":
            output = wrapper.export_qasm()
        elif option_output.lower() == "qiskit":
            output = wrapper.export_qiskit_commands(include_imports=True)
        elif option_output.lower() == "cirq":
            output = wrapper.export_cirq_json()
        elif option_output.lower() == "braket":
            output = wrapper.export_braket_ir()
        elif option_output.lower() == "qsharp":
            output = wrapper.export_qsharp()
        elif option_output.lower() == "quirk":
            output = wrapper.export_quirk()
        else:
            return "Bad Request!", 400
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500

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
        else:
            return "Bad Request!", 400

        if isExpert:
            if format == "OpenQASM":
                output= wrapper.export_qasm()
            elif format == "Quil":
                output= wrapper.export_quil()
            elif format == "Qiskit":
                output= wrapper.export_qiskit_commands(include_imports=True)
            elif format == "Pyquil":
                output= wrapper.export_pyquil_commands()
            else:
                return "Bad Request!", 400
        else:
            if option == "Rigetti":
                output = wrapper.export_quil()
            elif option == "IBMQ":
                output = wrapper.export_qasm()
            else:
                return "Bad Request!", 400

    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return str(e), 500    
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

        wrapper = CircuitWrapper(qiskit_instructions=circuit)
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


""""@app.route('/translate', methods=['Post'])
def translate():
    if request.headers.get("Content-Type") == "application/json":
        try:
            request_json = request.json
            circuit_string = request_json["circuit"]
            circuit_list = circuit_string.split("\n")
            circuit = "\n".join(circuit_list)
            lg_from = request_json["from"]
            lg_to = request_json["to"]
            return thandler.translate(circuit, lg_from, lg_to), 200
        except ValueError as ve:
            print(ve)
            return f"Error with the values passed for translation: {str(ve)}", 400
        except Exception as e:
            print(e)
            return f"Error with the formatting of the json: {str(e)}", 400

    else:
        return "Only JSON requests are supported!", 415"""



if __name__ == '__main__':
    app.run(host = '0.0.0.0', port=5012, debug=False)
