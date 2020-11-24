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
To start the server run:
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

To use the transpiler within another application, the methods of the circuit_wrapper provide the functionality to import, transpile, analyze, and export quantum circuits.

## Issues
The Drag and Drop tool has some minor bugs. Custom gates and quantum circuits consisting of several quantum/classical registers cannot be properly displayed in the graphical quantum circuit. Furthermore, the dragging of gates behaves incosistent in some cases.

