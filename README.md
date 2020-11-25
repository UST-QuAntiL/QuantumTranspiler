# Vendor-Independent Quantum Transpiler

The Vendor-Independent Quantum Transpiler is a quantum transpiling and analyzing framework written in Python3 that compiles quantum circuits for several QPUs. The user is guided through the whole process of importing, visualizing, editing, simulating and exporting quantum circuits. Additionally, the quantum circuit is analyzed regarding various QPUs and the transpiled, executable quantum circuit can be exported in the respective quantum instruction language. 

## Dependencies

There are several dependencies that need to be installed on the system. Some of the dependencies (e.g Qiskit and Pyquil) need gcc to be installed on the system. Furthermore, Python dev must be installed (e.g. sudo dnf install python3-devel).
It is recommended to install the following dependencies with [Pip](https://pip.pypa.io/en/stable/). 

```bash
pip install qiskit
pip install pyquil
pip install flask
pip install flask-cors
pip install pydot
pip install IPython
```

To access the coupling maps of the IBM QPUs an [IBM QX Token](https://quantum-computing.ibm.com/account) is needed. This must be saved in the environment to access the services (see [Access IBM Quantum Systems](https://qiskit.org/documentation/install.html#install-access-ibm-q-devices-label)).

### Frontend
The fronted is developed with [Angular](https://angular.io/):
 ```bash
npm install -g @angular/cli
cd frontend
npm install
```

## Usage
To start the server run (the default port is 5000):
```bash
python -m frontend_service.circuit_wrapper_service
```

To start the frontend run:
```bash
ng serve --open
```

The library is executed as a module.
Test Examples:
```bash
python3 -m conversion.test_circuit_converter   
python3 -m circuit.test_circuit_wrapper   
python3 -m test.e2e_test
```

The file e2e_test can be used to test the convert and unroll functionality of the transpiler. The results are compared with results from the Qiskit and Quil Transpiler (quilc). For this purpose the qvm and the quilc must be installed (see [PyQuil Docs](https://pyquil-docs.rigetti.com/en/stable/start.html)).

To use the transpiler within another application, the methods of the CircuitWrapper in circuit/circuit_wrapper.py provide the functionality to import, transpile, analyze, and export quantum circuits.

## Structure
In the following the structure of the directories and python files is explained.

### /circuit
The CircuitWrapper class defines the methods to interact with the implemented framework.

### /conversion
Contains the functionality for the import and export of quantum cirucits from Quil and PyQuil to Qiskit quantum circuits. /conversion/converter contains the classes for the iteration of the quantum circuits and the creation of the individual instructions. /conversion/mappings contains the mapping of quantum gates.

### /transpilation 
Contains the functionality to unroll a quantum circuit for a specific native gate set (in unroll.py). decompose.py can be used to decompose non standard gates to the Qiskit standard gates without specifying a native gate set. topology_mapping.py executes the mapping to physical qubits of the Qiskit library. equivalence_library.py contains the equivalent gates of the Qiskit gates U2 and U3, as well as, the gate CX for the unrolling step if the Rigetti native gate set is chosen.

### /examples
Contains example quantum circuits written in OpenQASM, Qiskit, Quil, and pyQuil. Furthermore, common QPU architectures from Rigetti and IBM QX are specified with their coupling maps.

### /frontend
Contains the Angular Webapp.

### /frontend_service
Contains the HTTP backend server (flask) that provides the functionality of the developed framework to other services like the frontend.

### /test
The TestTranspilation class in e2e_test.py can be used to test the transpilation and conversion functionality of the framework by comparing the simulation results of quantum circuits that are imported, transpiled, and exported with the developed framework with results that are achieved by directly executing the quantum circuit on Rigetti or Qiskit simulators.

/test/third_party_converter contains classes to interoperate with the frameworks Pennylane, Pytket, Quantastica, and Staq to test their functionality.

## Issues
The Drag and Drop tool has some minor bugs. Custom gates and quantum circuits consisting of several quantum/classical registers cannot be properly displayed in the graphical quantum circuit. Furthermore, the dragging of gates behaves incosistent in some cases.

