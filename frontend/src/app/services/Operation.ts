

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
    bits: number[];

    constructor(index, operation, parameter, bits) {
        this.index = index;
        this.operation = operation;
    }
}

// gates
const H = new Operation("H")
const CX = new Operation("CX", 2)
const CU1 = new Operation("CU1", 2)

// other instructions
const BARRIER = new Operation("Barrier", -1)
const MEASURE = new Operation("Measure", 1, 0, 1)

export let OperationMap = {
    "h": H,
    "cx": CX,
    "cu1": CU1,
    "barrier": BARRIER,
    "measure": MEASURE

}

