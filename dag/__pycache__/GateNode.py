from node import Node

GATES = []
class GateNode(Node):
    def __init__(self, name, matrix=None):
        super.__init__(name)
        
        self.isGate = True
        
        if matrix==None:
            self.standard_gate = True
            if not (name in GATES)
                raise 
            
        else:
            self.matrix = matrix
        
        
    