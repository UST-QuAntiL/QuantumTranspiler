from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from circuit.circuit_wrapper import CircuitWrapper
import json

app = Flask(__name__)
cors = CORS(app)

@app.route('/circuit_to_internal', methods=['Post'])
def circuit_to_internal():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    if option == "Quil":
        wrapper = CircuitWrapper(quil_str=circuit)
    elif option == "Pyquil":
        wrapper = CircuitWrapper(pyquil_instructions=circuit)
    elif option == "OpenQASM":
        wrapper = CircuitWrapper(qasm=circuit)
    elif option == "Qiskit":
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
    else:
        return "Bad Request!", 400

    output = wrapper.export_qiskit_commands()    
    return output

@app.route('/export_circuit', methods=['Post'])
def export_circuit():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    wrapper = CircuitWrapper(qiskit_instructions=circuit) 
    if option == "Quil":
        output = wrapper.export_quil()
    elif option == "Pyquil":
        output = wrapper.export_pyquil()
    elif option == "OpenQASM":
        output = wrapper.export_qasm()
    elif option == "Qiskit":
        output = wrapper.export_qiskit_commands()
    else:
        return "Bad Request!", 400

    print(output)
    return output

@app.route('/convert', methods=['Post'])
def export_circuit():
    data = request.json
    option = data["option"]
    option_output = data["optionOutput"]
    circuit = data["circuit"]
    if option == "Quil":
        wrapper = CircuitWrapper(quil_str=circuit)
    elif option == "Pyquil":
        wrapper = CircuitWrapper(pyquil_instructions=circuit)
    elif option == "OpenQASM":
        wrapper = CircuitWrapper(qasm=circuit)
    elif option == "Qiskit":
        wrapper = CircuitWrapper(qiskit_instructions=circuit)
    else:
        return "Bad Request!", 400

    if option_output == "Quil":
        output = wrapper.export_quil()
    elif option_output == "Pyquil":
        output = wrapper.export_pyquil()
    elif option_output == "OpenQASM":
        output = wrapper.export_qasm()
    elif option_output == "Qiskit":
        output = wrapper.export_qiskit_commands()
    else:
        return "Bad Request!", 400

    return output



if __name__ == '__main__':
    app.run(debug=True)
