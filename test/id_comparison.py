



from qiskit.aqua.quantum_instance import QuantumInstance
from qiskit.compiler.assemble import assemble
from qiskit.compiler.transpile import transpile
from qiskit.execute import execute
from qiskit.providers.aer import Aer
from qiskit.providers.aer.backends.qasm_simulator import QasmSimulator
from qiskit.providers.ibmq import IBMQ, least_busy
from examples.planqk_examples import bernstein_vazirani_general_qiskit_integer
from qiskit.circuit.quantumcircuit import QuantumCircuit

def run_circuit(circuit: QuantumCircuit):
    """account must be saved first: https://quantum-computing.ibm.com/"""
    provider = IBMQ.load_account()
    # print(provider.backends(simulator=False, operational=True))
    backend = provider.get_backend("ibmq_ourense")
    print(backend)
    mapped_circuit = transpile(circuit, backend=backend)
    qobj = assemble(mapped_circuit, backend=backend, shots=1024)
    job = backend.run(qobj)
    print("Job: ")
    print(job)
    print(job.status())
    print(job.job_id())
    result = job.result()
    counts = result.get_counts()
    print(counts)

    # backend = least_busy(large_enough_devices)
    # print("Backend " + backend.name())

    # shots = 1000
    # max_credits = 1 
    # job_exp = execute(circuit, backend=backend, shots=shots, max_credits=max_credits)
    # result_real = job_exp.result()
    # print(result_real.get_counts("qc"))
    
    # backend = QasmSimulator()
    # optimal simulation
    # backend_options = {"method": "statevector"}
    # simulation with noise
    # backend_options = {"method": "density_matrix"}
    # qobj = compile(circuit, backend, shots=2000)
    # job = execute(circuit, backend, backend_options=backend_options, optimization_level = 0)


    # result = job.result()
    # print(job)
    # counts = result.get_counts(circuit)
    # print(counts)



if __name__ == "__main__":
    circuit = bernstein_vazirani_general_qiskit_integer(4, 8, True) 
    # print(circuit.qasm())
    run_circuit(circuit)    

