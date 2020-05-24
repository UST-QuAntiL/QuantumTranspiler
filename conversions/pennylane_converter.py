import pennylane as qml
import pennylane_qiskit
import pennylane_forest
from pyquil import Program
from qiskit_utility import show_figure
from qiskit import QuantumCircuit
import pennylane_forest
from pennylane_device import QASMDevice 

class PennylaneConverter:
    @staticmethod
    def _function_to_qiskit_circuit(circuit_function) -> QuantumCircuit:
        # pseudo device needed to construct qnode
        dev = qml.device('qiskit.aer', wires=29, backend='qasm_simulator')  
        qnode = qml.QNode(circuit_function, dev)   
        # construct DAG
        qnode._construct(args=[], kwargs={})
        circuit_dag = qnode.circuit
        width = max(circuit_dag._grid.keys()) + 1
        # apply QASM conversion
        qasm_device = QASMDevice(width)
        qasm_device.apply(circuit_dag.operations, rotations=circuit_dag.diagonalizing_gates)  
        # qnode()
        qasm_device = dev
        return qasm_device._circuit

    @staticmethod
    def _function_to_qasm(circuit_function) -> str:
        return PennylaneConverter._function_to_qiskit_circuit(circuit_function).qasm()


    @staticmethod
    def quil_to_qasm(quil: str) -> str:
        program = Program(quil)
        return PennylaneConverter.pyquil_to_qasm(program)

    @staticmethod
    def pyquil_to_qasm(program: Program) -> str:
        width = program.wi
        def circuit_function():
            pennylane_forest.load_program(program)(wires=[0,2,3])
            return qml.expval(qml.PauliZ(0))
        return PennylaneConverter._function_to_qasm(circuit_function)
        

    @staticmethod
    def qasm_to_qasm(circuit: QuantumCircuit) -> str:
        def circuit_function():
            qml.from_qiskit(circuit)()
            return qml.expval(qml.PauliZ(0))
        return PennylaneConverter._function_to_qasm(circuit_function)    

        

        


        # @staticmethod
    # def optimize(qasm: str) -> str:


        
        