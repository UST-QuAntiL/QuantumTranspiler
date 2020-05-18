import retworkx as rx
import networkx as nx
from node import Node

class DAG():   
    
    def __init__(self):
        self.dag = rx.PyDAG()
        
        
    def add_node(self, node: Node) -> int:
        return self.dag.add_node(node)
    
    def add_edge(self, parent, child, edge):
        self.dag.add_edge(parent, child, edge)
        
    def to_networkx(self):
        """Returns a copy of the DAGCircuit in networkx format."""

        G = nx.MultiDiGraph()
        for node in self.dag.get_node_data():
            G.add_node(node)
            
        for node in self.topological_nodes():
            for source_id, dest_id, edge in self._get_multi_graph_in_edges(node._node_id):
                G.add_edge(self._id_to_node[source_id], self._id_to_node[dest_id],
                           **edge)

        return G
