import subprocess
from pyquil import Program

class QuantasticaConverter:
    @staticmethod
    def quil_to_qasm(quil: str) -> str:
        return QuantasticaConverter.wrap_input_output(quil, "quil", "qasm")   

    @staticmethod
    def pyquil_to_qasm(pyquil: Program) -> str:
        quil = pyquil.out()
        return QuantasticaConverter.wrap_input_output(quil, "quil", "qasm")   

    @staticmethod
    def qasm_to_quil(qasm: str) -> str:
        return QuantasticaConverter.wrap_input_output(qasm, "qasm", "quil")   

    @staticmethod
    def qasm_to_pyquil(qasm: str) -> str:
        return QuantasticaConverter.wrap_input_output(qasm, "qasm", "pyquil")   

    
    @staticmethod
    def call_qconvert(input_file, source_format, output_file, destination_format) -> None:	
        output = subprocess.run(["q-convert", "-i", "temp_files/" + input_file, "-s", source_format, "-o", "temp_files/" + output_file, "-d", destination_format, "-w"], capture_output=True)
        print(output.stdout.decode("utf-8"))
        # if (output.stderr):
        #     print("Error at q-convert:" + output.stderr.decode("utf-8"))
        #     raise ChildProcessError(output.stderr.decode("utf-8"))

    @staticmethod
    def wrap_input_output(input_str, source_format, destination_format) -> str:	
        input_file = "qconvert_input." + source_format
        output_file = "qconvert_output." + destination_format

        with open("temp_files/" + input_file, "w") as f:       
            f.write(input_str)

        QuantasticaConverter.call_qconvert(input_file, source_format, output_file, destination_format)

        with open("temp_files/" + output_file, "r") as f:       
            output_str = f.read()

        return output_str

       