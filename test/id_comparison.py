from qiskit.compiler.assemble import assemble
from qiskit.compiler.transpile import transpile
from qiskit.execute import execute
from qiskit.providers.aer import Aer
from qiskit.providers.ibmq import IBMQ, least_busy
from examples.planqk_examples import bernstein_vazirani_general_qiskit_binary_string, bernstein_vazirani_general_qiskit_integer
from qiskit.circuit.quantumcircuit import QuantumCircuit
from qiskit.visualization import plot_histogram
# optimizing algorithms:
# from qiskit.optimization.algorithms
# decompose algorithms:
# from qiskit.extensions.unitary import UnitaryGate
# from qiskit.quantum_info.synthesis


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


def draw(circuit: QuantumCircuit):
    # circuit.draw(output='latex_source', filename="./test/results/circuit.tex")
    circuit.draw(output='mpl', filename="./test/results/circuit.png")


def analyze_circuit(circuit: QuantumCircuit):
    provider = IBMQ.load_account()
    backend = provider.get_backend("ibmq_ourense")
    print(circuit)
    mapped_circuit = transpile(circuit, backend=backend, optimization_level=0)
    qobj = assemble(mapped_circuit, backend=backend, shots=8192)
    print(mapped_circuit)
    print(qobj)


def simulate_circuit(circuit: QuantumCircuit):
    simulator = Aer.get_backend('qasm_simulator')
    job = execute(circuit, simulator, shots=1000)
    result = job.result()
    counts = result.get_counts(circuit)    
    figure = plot_histogram(counts)
    figure.savefig("./test/results/plot.pdf")
     