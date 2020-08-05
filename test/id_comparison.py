



from examples.custom_circuits import iden_circuit
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
    qobj = assemble(mapped_circuit, backend=backend, shots=8192)
    # print(qobj)
    job = backend.run(qobj)

    print("Job: ")
    print(job)
    print(job.status())
    print(job.job_id())
    result = job.result()
    counts = result.get_counts()
    print(counts)

if __name__ == "__main__":
    # circuit = bernstein_vazirani_general_qiskit_integer(4, 8, True) 
    circuit = iden_circuit(True)
    run_circuit(circuit)    

