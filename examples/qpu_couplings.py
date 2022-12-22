from qiskit.providers.ibmq import IBMQ
from qiskit.transpiler import CouplingMap

# Rigetti Aspen
def aspen_4():
    coupling = CouplingMap([
        [0, 1],
        [0, 4],
        [1, 2],
        [2, 3],
        [2, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 11],
    ])
    coupling.make_symmetric()
    return coupling


# IBMQ
def ibmq(qpu_name: str):  
    provider = IBMQ.load_account()  
    backend = provider.get_backend(qpu_name)
    return CouplingMap(backend.configuration().coupling_map)

# device names
def ibmq_qasm_simulator():
    return ibmq("ibmq_qasm_simulator")
def ibmqx2():
    return ibmq("ibmqx2")
def ibmq_16_melbourne():
    return ibmq("ibmq_16_melbourne")
def ibmq_vigo():
    return ibmq("ibmq_vigo")
def ibmq_ourense():
    return ibmq("ibmq_ourense")
def ibmq_valencia():
    return ibmq("ibmq_valencia")
def ibmq_london():
    return ibmq("ibmq_london")
def ibmq_essex():
    return ibmq("ibmq_essex")
def ibmq_burlington():
    return ibmq("ibmq_burlington")
def ibmq_santiago():
    return ibmq("ibmq_santiago")

def qpus():
    qpus = {
        "aspen_4": ["r", 3, aspen_4()],
        "ibmqx2": ["q", 3, ibmqx2()],
        "ibmq_16_melbourne": ["q", 3, ibmq_16_melbourne()],
        "ibmq_vigo": ["q", 3, ibmq_vigo()],
        "ibmq_ourense": ["q", 3, ibmq_ourense()],
        "ibmq_valencia": ["q", 3, ibmq_valencia()],
        "ibmq_london": ["q", 3, ibmq_london()],
        "ibmq_essex": ["q", 3, ibmq_essex()],
        "ibmq_burlington": ["q", 3, ibmq_burlington()],
        "ibmq_santiago": ["q", 3, ibmq_santiago()],
    }
    return qpus

if __name__ == "__main__":
    # map = ibmq_ourense()
    map = aspen_4()
    print(map)
