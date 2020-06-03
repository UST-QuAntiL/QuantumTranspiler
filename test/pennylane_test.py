import pennylane as qml
import numpy as np
from pennylane_qiskit import qiskit_device, IBMQDevice
from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit, execute, Aer, IBMQ
from qiskit.test.mock import FakeTenerife  

def my_quantum_function(x, y):
    qml.RZ(x, wires=0)
    qml.CNOT(wires=[0,1])
    qml.CNOT(wires=[1,0])
    qml.RY(y, wires=1)
    return qml.expval(qml.PauliZ(1))
result = my_quantum_function(0, 1)
# dev = qml.device('qiskit.aer', wires=29, backend='qasm_simulator')
dev = qml.device('strawberryfields.fock', wires=2, cutoff_dim=10)

circuit = qml.QNode(my_quantum_function, dev)
 
circuit(np.pi/4, 0.7)
dev._circuit.draw(output='text')
print(dev._circuit)  
print(circuit.draw(show_variable_names=True))
# from pkg_resources import iter_entry_points
# plugin_converters = {entry.name: entry for entry in iter_entry_points("pennylane.io")}
# plugin_converter = plugin_converters["qiskit"].load()
# plugin_converter(circuit())
# print(plugin_converters)

import pennylane_qiskit
pennylane_qiskit.load()


import pennylane_forest
pennylane_forest.load_program()


# from pennylane.templates.layers import BasicEntanglerLayers
