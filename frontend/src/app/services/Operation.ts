export class Operation {
    name: string;
    numberOfParameter: number;
    numberOfQubits: number;
    numberOfClbits: number;

    constructor(name, numberOfQubits = 1, numberOfParameter = 0, numberOfClbits = 0) {
        this.name = name;
        this.numberOfParameter = numberOfParameter;
        this.numberOfQubits = numberOfQubits;
        this.numberOfClbits = numberOfClbits;
    }
}


export class OperationIndex {
    index: number;
    operation: Operation;
    parameter: number[];
    qubits: number[];
    clbits: number[];
    lineNumberInCircuit: number[];

    constructor(index, operation, parameter, qubits, clbits, lineNumberInCircuit) {
        this.index = index;
        this.operation = operation;
        this.qubits = qubits;
        this.clbits = clbits;
        this.lineNumberInCircuit = lineNumberInCircuit;
    }
}

// gates
const H = new Operation("H")
const CX = new Operation("CX", 2)
const CU1 = new Operation("CU1", 2)

// other instructions
const BARRIER = new Operation("Barrier", -1)
const MEASURE = new Operation("Measure", 1, 0, 1)

export let gateMap = {
    "h": H,
    "cx": CX,
    "cu1": CU1,
}

export let operationMapLocal = {    
    "barrier": BARRIER,
    "measure": MEASURE
}

for (let key in gateMap) {
    operationMapLocal[key] = gateMap[key];
} 
export let operationMap = operationMapLocal;

let operationListLocal = [];
for (let key in operationMap) {
    operationListLocal.push(operationMap[key]);
}

export let operationList = operationListLocal;

