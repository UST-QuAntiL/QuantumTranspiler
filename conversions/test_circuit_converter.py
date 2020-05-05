import unittest
from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT
from circuit_converter import CircuitConverter
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
        qasm_converted = CircuitConverter.pyquil_to_qasm(self.pyquil_circuit)        
        qasm = self.qiskit_circuit.qasm()
        
        self.assertEqual(TestCircuitConverter.__remove_new_lines(qasm), TestCircuitConverter.__remove_new_lines(qasm_converted))

    def test_qiskit_to_qasm(self):
        qasm = self.qiskit_circuit.qasm()
        qasm_converted = CircuitConverter.qiskit_to_qasm(self.qiskit_circuit)
        
        self.assertEqual(TestCircuitConverter.__remove_new_lines(qasm), TestCircuitConverter.__remove_new_lines(qasm_converted)) 

        
    def test_pyquil_conversions(self):
        original = self.pyquil_circuit
        converted = CircuitConverter.dag_to_pyquil(CircuitConverter.pyquil_to_dag(original))    
        print(original)   
        print(converted) 
        self.assertEqual(original, converted)
        
    def test_qiskit_conversions(self):
        original = self.qiskit_circuit
        converted = CircuitConverter.dag_to_qiskit(CircuitConverter.qiskit_to_dag(original))
        self.__draw_qiskit_circuit(original)
        self.__draw_qiskit_circuit(converted)
        self.assertEqual(original, converted)
        

    

if __name__ == "__main__":
    unittest.main()
