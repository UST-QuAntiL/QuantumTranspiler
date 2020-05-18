import unittest
from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT
from cirq_converter import CirqConverter
from pyquil_converter import PyquilConverter
from qiskit_converter import QiskitConverter
from dag_converter import DagConverter

from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer

class TestCircuitConverter(unittest.TestCase):
    @staticmethod
    def __remove_new_lines(string: str) -> str:
        return string.replace('\n', '') 
    
    @staticmethod   
    def __draw_qiskit_circuit(circuit):
        circuit.draw(output='text')
        print(circuit)   
       
        
    def __init__(self, *args, **kwargs):
        super(TestCircuitConverter, self).__init__(*args, **kwargs)        
        # init example circuits
        self.qiskit_circuit = QuantumCircuit(2)
        self.qiskit_circuit.h(0)
        self.qiskit_circuit.cx(0, 1)        
        self.pyquil_circuit = Program(H(0), CNOT(0, 1))
        
        

    def test_pyquil_to_qasm(self):
        qasm_converted = PyquilConverter.pyquil_to_qasm(self.pyquil_circuit)        
        qasm = self.qiskit_circuit.qasm()
        
        self.assertEqual(TestCircuitConverter.__remove_new_lines(qasm), TestCircuitConverter.__remove_new_lines(qasm_converted))

    def test_qiskit_to_qasm(self):
        qasm = self.qiskit_circuit.qasm()
        qasm_converted = QiskitConverter.qiskit_to_qasm(self.qiskit_circuit)
        
        self.assertEqual(TestCircuitConverter.__remove_new_lines(qasm), TestCircuitConverter.__remove_new_lines(qasm_converted)) 

        
    def test_pyquil_conversions(self):
        original = PyquilConverter.qasm_to_pyquil(QiskitConverter.qiskit_to_qasm(self.qiskit_circuit))
        converted = PyquilConverter.dag_to_pyquil(PyquilConverter.pyquil_to_dag(original))    
        # print(original)   
        # print(converted) 
        self.assertEqual(original, converted)
        
    def test_qiskit_conversions(self):
        original = self.qiskit_circuit
        converted = QiskitConverter.dag_to_qiskit(QiskitConverter.qiskit_to_dag(original))
        # self.__draw_qiskit_circuit(original)
        # self.__draw_qiskit_circuit(converted)
        self.assertEqual(original, converted)
        
    def test_cirq_conversions(self):
        original =  CirqConverter.qasm_to_cirq(QiskitConverter.qiskit_to_qasm(self.qiskit_circuit))
        converted = CirqConverter.dag_to_cirq(CirqConverter.cirq_to_dag(original))
        # print(original)   
        # print(converted) 
        self.assertEqual(original, converted)
        
    
        
class ManualTest():
    @staticmethod  
    def test_quirk_import():
        circuit = CirqConverter.quirk_to_cirq("https://algassert.com/quirk#circuit=%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%22%E2%80%A2%22%2C%22%E2%80%A2%22%2C%22X%22%5D%5D%7D")
        print(circuit)
    

if __name__ == "__main__":
    unittest.main()
    # ManualTest.test_quirk_import()
