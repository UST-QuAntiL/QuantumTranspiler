# Vendor-Independent Quantum Transpiler

The Vendor-Independent Quantum Transpiler is a quantum transpiler written in Python3 that compiles quantum circuits for several QPUs. The transpiler supports importing and exporting circuits from various quantum platforms and quantum instruction languages.

## Dependencies

There are several dependencies that need to be installed on the system. Some of the dependencies (e.g Qiskit and Pyquil) need gcc to be installed on the system. Furthermore, Python dev must be installed (e.g. sudo dnf install python3-devel).
It is recommended to install them with [Pip](https://pip.pypa.io/en/stable/). 

```bash
pip install qiskit
pip install pyquil
pip install flask
pip install flask-cors
pip install pydot
```

### Optional dependencies:
For the usage of pydot (used for drawing of dags) [Graphviz](http://www.graphviz.org/download/) need to be installed on the system.


## Usage
To start the server run:
```bash
python -m frontend_service.circuit_wrapper_service
```

The library is executed as a module.
Test Examples:
```bash
python3 -m conversion.test_circuit_converter   
python3 -m circuit.test_circuit_wrapper   
python3 -m test.2.2_test
```
