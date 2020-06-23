# Vendor-Independent Quantum Transpiler

The Vendor-Independent Quantum Transpiler is a quantum transpiler written in Python3 that compiles quantum circuits for several QPUs. The transpiler supports importing and exporting circuits from various quantum platforms and quantum instruction languages.

## Dependencies

There are several dependencies that need to be installed on the system.
It is recommended to install them with [Pip](https://pip.pypa.io/en/stable/).

```bash
pip install qiskit
pip install pyquil
```

## Usage

The library is executed as a module.
Examples:
```bash
python3 -m conversion.test_circuit_converter   
python3 -m circuit.test_circuit_wrapper   
```
