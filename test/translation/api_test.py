import requests
import json
from qiskit import QuantumCircuit
from translation.translator_names import TranslatorNames


def simpleTest():
    c = QuantumCircuit(2, 1)
    c.h(0)
    c.cx(0, 1)
    print(c.qasm())
    dict = {"circuit": c.qasm(), "from": f"{TranslatorNames.OPENQASM.value}", "to": f"{TranslatorNames.BRAKET.value}"}
    print(dict)
    djson = json.dumps(dict)
    x = requests.post("http://192.168.178.82:5012/translate", data=djson, headers={"Content-Type": "application/json"})
    print(x.text)

simpleTest()