from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from circuit.circuit_wrapper import CircuitWrapper
import json

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/circuit_to_internal', methods=['Post'])
@cross_origin()
def circuit_to_internal():
    data = request.json
    option = data["option"]
    circuit = data["circuit"]
    print(option)

    return request.json



if __name__ == '__main__':
    app.run(debug=True)
