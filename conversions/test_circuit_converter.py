from pytket.qasm import circuit_from_qasm, circuit_to_qasm
from pytket.pyquil import pyquil_to_tk
from pyquil import Program, get_qc
from pyquil.gates import H, CNOT, CCNOT
from pytket_converter import PytketConverter
from qiskit_utility import show_figure
from staq_converter import StaqConverter
from qiskit import QuantumCircuit
from qiskit.tools.visualization import dag_drawer
from qiskit.aqua.algorithms import Shor
from pennylane_converter import PennylaneConverter
from quantastica_converter import QuantasticaConverter
from pyquil.gates import *
from pyquil_converter import PyquilConverter

class TestCircuitConverter:
    def _remove_new_lines(self, string: str) -> str:
        return string.replace('\n', '')

    def _draw_qiskit_circuit(self, circuit):
        circuit.draw(output='text')
        print(circuit)

    def __init__(self):
        self.qiskit_circuit_create()
        self.pyquil_circuit_create()
        self.shor_qiskit_create()
        self.shor_pyquil_create()
        self.shor_quil_create()

    def qiskit_circuit_create(self):
        self.qiskit_circuit = QuantumCircuit(2, 2)
        self.qiskit_circuit.h(0)
        self.qiskit_circuit.cx(0, 1)
        self.qiskit_circuit.measure_all()
        self.qasm = self.qiskit_circuit.qasm()

    def pyquil_circuit_create(self):
        self.pyquil_circuit = Program()
        ro = self.pyquil_circuit.declare('ro', 'BIT', 1)
        self.pyquil_circuit += H(0)
        self.pyquil_circuit += CNOT(0, 1)
        self.pyquil_circuit += H(2)
        self.pyquil_circuit += CCNOT(0,1,2)
        self.pyquil_circuit += MEASURE(0, ro[0])

    def shor_pyquil_create(self):
        p = Program()
        ro = p.declare('ro', memory_type='BIT', memory_size=3)
        p.inst(H(0))
        p.inst(H(1))
        p.inst(H(2))
        p.inst(H(1))
        p.inst(CNOT(2, 3))
        p.inst(CPHASE(0, 1, 0))
        p.inst(CNOT(2, 4))
        p.inst(H(0))
        p.inst(CPHASE(0, 1, 2))
        p.inst(CPHASE(0, 0, 2))
        p.inst(H(2))
        p.inst(MEASURE(0, ro[0]))
        p.inst(MEASURE(1, ro[1]))
        p.inst(MEASURE(2, ro[2]))

        self.shor_pyquil = p

    def shor_qiskit_create(self):
        with open("circuit_shor.qasm", "r") as f:
            self.shor_qasm = f.read()
            self.shor_qiskit = QuantumCircuit.from_qasm_str(self.shor_qasm)

    def shor_quil_create(self):
        with open("circuit_shor.quil", "r") as f:
            self.shor_quil = f.read()

    def test_pytket(self):
        qasm = PytketConverter.pyquil_to_qasm(self.shor_pyquil)       
        # does not support cu1 gates 
        pyquil = PytketConverter.qasm_to_pyquil(self.shor_qasm)   
        print(pyquil)   

        # # quirk import
        # circuit = PytketConverter.quirk_to_cirq("https://algassert.com/quirk#circuit=%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%22%E2%80%A2%22%2C%22%E2%80%A2%22%2C%22X%22%5D%5D%7D")
        # print(circuit)
        

    def test_staq(self):
        staq = StaqConverter("/home/seedrix/tools/staq/build/staq", self.shor_qasm)
        # quil = staq.qasm_to_quil()   
        # does not work, because of undefined Dagger instruction
        # program = Program(quil) 
        # projectq = staq.qasm_to_projectq()
        # qsharp = staq.qasm_to_qsharp()
        # cirq = staq.qasm_to_cirq()
        # staq.inline()
        # staq.o2()
        staq.default_optimization()        
        
    def test_pennylane(self):
        # print(PennylaneConverter.pyquil_to_qasm(self.pyquil_circuit))
        print(PennylaneConverter.qasm_to_qasm(self.shor_qiskit))

    def test_quantastica(self):
        # qasm = QuantasticaConverter.quil_to_qasm(self.shor_quil)
        # print(qasm)
        # circuit = QuantumCircuit.from_qasm_str(qasm)
        # show_figure(circuit)
        quil = QuantasticaConverter.qasm_to_quil(self.shor_qasm)
        print(quil)

    def test_pyquil_own(self):
        PyquilConverter.import_pyquil(self.pyquil_circuit)

        


        

if __name__ == "__main__":
    test = TestCircuitConverter()
    test.test_pyquil_own()
