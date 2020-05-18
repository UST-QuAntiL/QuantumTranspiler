import pennylane as qml
import numpy as np
from ibm import circuit
# def my_quantum_function(x, y):
#     qml.RZ(x, wires=0)
#     qml.CNOT(wires=[0,1])
#     qml.RY(y, wires=1)
#     return qml.expval(qml.PauliZ(1))
# result = my_quantum_function(0, 1)

# dev = qml.device('qiskit.aer', wires=2)
# circuit = qml.QNode(my_quantum_function, dev)

# circuit(np.pi/4, 0.7)
# print(circuit.draw(show_variable_names=True))
# from pkg_resources import iter_entry_points
# plugin_converters = {entry.name: entry for entry in iter_entry_points("pennylane.io")}
# plugin_converter = plugin_converters["qiskit"].load()
# plugin_converter(circuit())
# print(plugin_converters)

import pennylane_qiskit
pennylane_qiskit.load_qasm()


import pennylane_forest
pennylane_forest.load_quil()



from pennylane.templates.layers import BasicEntanglerLayers
