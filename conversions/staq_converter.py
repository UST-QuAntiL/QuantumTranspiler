import subprocess
from dag_converter import DagConverter

class StaqConverter: 
    """
        docs: https://github.com/softwareQinc/staq/wiki/The-staq-compiler
    """
    def __init__(self, staqPath: str, qasm: str, overwrite_input_circuit=True):
        self.staqPath = staqPath
        self.input_qasm = "circuit.qasm"
        if overwrite_input_circuit:
            self.output_qasm = "circuit.qasm"
        else:
            self.output_qasm = "circuit_output.qasm"
        self.set_input_qasm(qasm)  

    def set_input_qasm(self, qasm: str):        
        DagConverter.write_qasm(qasm, self.input_qasm)

    def set_output_qasm(self, qasm: str):
        DagConverter.write_qasm(qasm, self.output_qasm)

    def qasm_to_quil(self) -> str:
        """
            exported quil string cannot be imported to Pyquil, because it inserts Dagger instruction that is not defined (at several places)
        """        
        output = subprocess.run([self.staqPath, "-f", "quil",self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        return output_str

    def qasm_to_projectq(self) -> str:
        output = subprocess.run([self.staqPath, "-f", "projectq",self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        return output_str

    def qasm_to_qsharp(self) -> str:
        output = subprocess.run([self.staqPath, "-f", "qsharp",self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        return output_str

    def qasm_to_cirq(self) -> str:
        output = subprocess.run([self.staqPath, "-f", "cirq",self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        return output_str

    def inline(self):
        output = subprocess.run([self.staqPath, "-i", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def synthesize(self):
        output = subprocess.run([self.staqPath, "-S", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def rotation_fold(self):
        output = subprocess.run([self.staqPath, "-r", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def cnot_resynth(self):
        output = subprocess.run([self.staqPath, "-c", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def symplify(self):
        output = subprocess.run([self.staqPath, "-s", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def o1(self):
        output = subprocess.run([self.staqPath, "-O1", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def o2(self):
        output = subprocess.run([self.staqPath, "-O2", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)

    def o3(self):
        output = subprocess.run([self.staqPath, "-O3", self.input_qasm], capture_output=True)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)


    def map_to_device(self, device: str):
        """
            always maps to the U, CX gate set 
            devices are hardcoded, the following exist: (tokyo, agave, aspen4, singapore, square_9q, fullycon)  
            can be added by adding device objects to https://github.com/softwareQinc/staq/blob/master/include/mapping/device.hpp and recompiling 
            TODO does not work as expected (but also the command line tool does not work on circuit_shor)      
        """
        output = subprocess.run([self.staqPath, "-m", "-d", device, self.input_qasm], capture_output=True)
        print(output)
        output_str = output.stdout.decode("utf-8")
        self.set_output_qasm(output_str)
        
    def default_optimization(self):
        self.synthesize()
        self.inline()
        self.symplify()
        self.rotation_fold()
        self.inline()
        self.cnot_resynth()
        self.inline()

    
    
    




