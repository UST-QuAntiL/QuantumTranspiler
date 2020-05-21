from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT
from pytket_converter import PytketConverter
from dag_converter import DagConverter
from staq_converter import StaqConverter
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor

class TestCircuitConverter():
    def _remove_new_lines(self, string: str) -> str:
        return string.replace('\n', '') 
    
    def _draw_qiskit_circuit(self, circuit):
        circuit.draw(output='text')
        print(circuit)   
       
        
    def __init__(self):
        self.qiskit_circuit_create()
        self.pyquil_circuit_create()
        self.shor_qiskit_create()      
        

    def qiskit_circuit_create(self):
        self.qiskit_circuit = QuantumCircuit(2)
        self.qiskit_circuit.h(0)
        self.qiskit_circuit.cx(0, 1) 
        self.qasm = self.qiskit_circuit.qasm()

    def pyquil_circuit_create(self):
        self.pyquil_circuit = Program(H(0), CNOT(0, 1))       
        
    def shor_qiskit_create(self):
        # N = 15
        # shor = Shor(N)
        # shor_circuit = shor.construct_circuit()
        # self.shor = shor_circuit.qasm()

        with open("circuit_shor.qasm", "r") as f:
            self.shor = f.read()

    def test_pytket(self):
        original = PytketConverter.pyquil_to_qasm(self.pyquil_circuit)        
        converted = self.qiskit_circuit.qasm()

        original = self.qiskit_circuit.qasm()
        converted = PytketConverter.qiskit_to_qasm(self.qiskit_circuit)

        original = PytketConverter.qasm_to_pyquil(PytketConverter.qiskit_to_qasm(self.qiskit_circuit))
        converted = PytketConverter.dag_to_pyquil(PytketConverter.pyquil_to_dag(original))  

        original = self.qiskit_circuit
        converted = PytketConverter.dag_to_qiskit(PytketConverter.qiskit_to_dag(original))

        original =  PytketConverter.qasm_to_cirq(PytketConverter.qiskit_to_qasm(self.qiskit_circuit))
        converted = PytketConverter.dag_to_cirq(PytketConverter.cirq_to_dag(original))
        
        print(original)   
        print(converted) 

    def test_quirk_import(self):
        circuit = PytketConverter.quirk_to_cirq("https://algassert.com/quirk#circuit=%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%22%E2%80%A2%22%2C%22%E2%80%A2%22%2C%22X%22%5D%5D%7D")
        print(circuit)

    def test_staq(self):
        staq = StaqConverter("/home/seedrix/tools/staq/build/staq", self.shor)
        # quil = staq.qasm_to_quil()   
        # does not work, because of undefined Dagger instruction
        # program = Program(quil) 
        # projectq = staq.qasm_to_projectq()
        # qsharp = staq.qasm_to_qsharp()
        # cirq = staq.qasm_to_cirq()
        # staq.inline()
        # staq.o2()
        staq.default_optimization()


        
        

        

if __name__ == "__main__":
    test = TestCircuitConverter()
    test.test_staq_conversions()
