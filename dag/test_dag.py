from dag import DAG
from node import Node

if __name__ == "__main__":
    dag = DAG()
    node = Node("cx")
    dn = dag.add_node(node)
    dn = dag.add_node(node)
    dag.add_edge(0, 1, "control")
    print(dag.dag)
