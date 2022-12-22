# Vendor-Independent Quantum Transpiler

The Vendor-Independent Quantum Transpiler is a quantum transpilation and analysis framework written in Python that compiles quantum circuits for several QPUs. The user is guided through the whole process of importing, visualizing, editing, simulating and exporting quantum circuits. Additionally, the quantum circuit is analyzed regarding various QPUs and the transpiled, executable quantum circuit can be exported in the respective quantum instruction language. 

## Setup

### Docker

* Clone repository:
```
git clone https://github.com/UST-QuAntiL/QuantumTranspiler.git
```
* Start containers:
```
docker-compose pull
docker-compose up
```

After the containers started, the QuantumTranspiler backend and frontend are available at http://localhost:5012/ and http://localhost:5011/ respectively.

### Local

#### Backend
Python dependencies are installed using pip.
```
pip install -r requirements.txt
```


Since this project uses [Q#](https://learn.microsoft.com/en-us/azure/quantum/install-python-qdk?tabs=tabid-conda) and [Rigetti](https://pyquil-docs.rigetti.com/en/stable/start.html) simulation, these frameworks also need to be installed.
Make sure that the qsharp package is installed and the python environment is active before attempting to install iqsharp.
* Installing .NET 6.0  
  * On Windows, dotnet can be installed using winget.
  * For Linux and other platforms, follow the instructions [here](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).
```bash
winget install Microsoft.DotNet.SDK.6
```
  * Troubleshooting:  
If the installation fails, check that python and jupyter are installed and active in the current environment or
try adding nuget with dotnet.
```bash
dotnet nuget add source --name nuget.org https://api.nuget.org/v3/index.json
```

  * Installing IQSharp using .NET
```bash
dotnet tool install -g Microsoft.Quantum.IQSharp
dotnet iqsharp install
```
* Installing the ForestSDK

Download the fitting SDK for your operating system from [here](https://qcs.rigetti.com/sdk-downloads).

On Windows, simply execute the .msi file.

On Linux (deb), execute the following commands:
```bash
tar -xf forest-sdk-linux-deb.tar.bz2
cd forest-sdk-<version>-linux-deb
sudo ./forest-sdk-<version>-linux-deb.run
```
To access the coupling maps of the IBM QPUs, an [IBM Quantum Token](https://quantum-computing.ibm.com/account) is needed. This must be saved in the environment to access the services (see [Access IBM Quantum Systems](https://qiskit.org/documentation/install.html#install-access-ibm-q-devices-label)).

To start the backend, run:
```bash
python -m api.api_service
```
It will now be available at http://localhost:5012/.

#### Frontend
The fronted is developed with [Angular](https://angular.io/):
 ```bash
npm install -g @angular/cli
cd frontend
npm install
```
The frontend needs the URL of the Backend as input. This can be set via the apiUrl variable in frontend/src/environments/environment.ts (default 5012).

To start the frontend, run:
```bash
ng serve --open
```
It can now be accessed at http://localhost:5011/. 
#### Tests
Tests are executed using unittest.
Basic converter tests are located in test.converter_tests
```bash 
python -m unittest test.converter_tests.<language>_test
```

The file e2e_test can be used to test the convert and unroll functionality of the transpiler. The results are compared with results from the Qiskit and Quil Transpiler (quilc).

## Structure
In the following the structure of the directories and python files is explained.

### /circuit
The CircuitWrapper class defines the methods to interact with the implemented framework.

### /conversion
Contains the functionality for the import and export of quantum cirucits from Quil and PyQuil to Qiskit quantum circuits. /conversion/converter contains the classes for the iteration of the quantum circuits and the creation of the individual instructions. /conversion/mappings contains the mapping of quantum gates.

### /transpilation 
Contains the functionality to unroll a quantum circuit for a specific native gate set (in unroll.py). decompose.py can be used to decompose non standard gates to the Qiskit standard gates without specifying a native gate set. topology_mapping.py executes the mapping to physical qubits of the Qiskit library. equivalence_library.py contains the equivalent gates of the Qiskit gates U2 and U3, as well as, the gate CX for the unrolling step if the Rigetti native gate set is chosen.

### /examples
Contains example quantum circuits written in OpenQASM, Qiskit, Quil, and pyQuil. Furthermore, common QPU architectures from Rigetti and IBM Quantum are specified with their coupling maps.

### /frontend
Contains the Angular Webapp.

### /frontend_service
Contains the HTTP backend server (flask) that provides the functionality of the developed framework to other services like the frontend.

### /test
Contains tests for the converters, as well as other tests.

## Issues
The Drag and Drop tool has some minor bugs. Custom gates and quantum circuits consisting of several quantum/classical registers cannot be properly displayed in the graphical quantum circuit. Furthermore, the dragging of gates behaves incosistent in some cases.

## Include new SDK
For the inclusion of a new SDK, a python class must be written that inherits from ConverterInterface (see e.g. conversion/converter/pyquil_converter.py). Furthermore, the respective equivalent gates must be specified in conversion/mappings/gate_mappings.py. If concepts or gates do not need to be supported, they can be omitted and a warning (warnings.warn() should be thrown instead.
