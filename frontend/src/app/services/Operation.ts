export class Operation {
    name: string;
    numberOfParameter: number;
    numberOfQubits: number;
    numberOfClbits: number;
    numberOfCtrlBits: number;

    constructor(name, numberOfQubits = 1, numberOfParameter = 0, numberOfClbits = 0, numberOfCtrlBits = 0) {
        this.name = name;
        this.numberOfParameter = numberOfParameter;
        this.numberOfQubits = numberOfQubits;
        this.numberOfClbits = numberOfClbits;
        this.numberOfCtrlBits = numberOfCtrlBits;
    }
}


export class OperationIndex {
    placeholder: boolean;
    control: boolean;
    index: number;
    operation: Operation;
    parameter: number[];
    qubits: number[];
    clbits: number[];
    lineNumbersInCircuit: number[];

    constructor(index, operation, parameter, qubits, clbits, lineNumbersInCircuit, placeholder = false, control = false) {
        this.index = index;
        this.operation = operation;
        this.parameter = parameter;
        this.qubits = qubits;
        this.clbits = clbits;
        this.lineNumbersInCircuit = lineNumbersInCircuit;
        this.placeholder = placeholder;
        this.control = control;    
    }
}

// gates
const H = new Operation("H")
const X = new Operation("X")
const Y = new Operation("Y")
const CX = new Operation("CX", 2, 0, 0, 1)
const CU1 = new Operation("CU1", 2, 1, 0, 1)

// other instructions
const BARRIER = new Operation("Barrier", -1)
const MEASURE = new Operation("Measure", 1, 0, 1)

export let gateMap = {
    "h": H,
    "cx": CX,
    "cu1": CU1,
    "x": X,
    "y": Y,
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

