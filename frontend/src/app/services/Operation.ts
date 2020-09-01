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

    generateList(number: number): any[] {
        let list = []
        for (let i = 0; i < number; i++) {
            list.push(null)
        }
        return list
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
const I = new Operation("I")
const S = new Operation("S")
const SX = new Operation("SX")
const SXDG = new Operation("SXDG")
const SDG = new Operation("SDG")
const T = new Operation("T")
const TDG = new Operation("TDG")
const U = new Operation("U", 1, 3)
const U1 = new Operation("U1", 1, 1)
const U2 = new Operation("U2", 1, 2)
const U3 = new Operation("U3", 1, 3)
const X = new Operation("X")
const Y = new Operation("Y")
const Z = new Operation("Z")

const CCX = new Operation("CCX", 3, 0, 0, 2)
const C3X = new Operation("C3X", 4, 0, 0, 3)
const C4X = new Operation("C4X", 5, 0, 0, 2)
const DCX = new Operation("DCX", 2, 0, 0, 0)
const CH = new Operation("CH", 2, 0, 0, 1)
const CPHASE = new Operation("CPHASE", 2, 1, 0, 1)
const CRX = new Operation("CRX", 2, 1, 0, 1)
const CRY = new Operation("CRY", 2, 1, 0, 1)
const CRZ = new Operation("CRZ", 2, 1, 0, 1)
const CSWAP = new Operation("CSWAP", 3, 0, 0, 1)
const CSX = new Operation("CSX", 2, 0, 0, 1)
const CU = new Operation("CU", 2, 4, 0, 1)
const CU1 = new Operation("CU1", 2, 1, 0, 1)
const CU3 = new Operation("CU3", 2, 3, 0, 1)
const CX = new Operation("CX", 2, 0, 0, 1)
const CY = new Operation("CY", 2, 0, 0, 1)
const CZ = new Operation("CZ", 2, 0, 0, 1)
const MS = new Operation("MS", 2, 0, 0, 0)
const PHASE = new Operation("PHASE", 1, 1, 0, 0)
const RCCX = new Operation("RCCX", 3, 0, 0, 2)
const RC3X = new Operation("RC3X", 4, 0, 0, 3)
const RX = new Operation("RCCX", 1, 1, 0, 0)
const RXX = new Operation("RXX", 2, 1, 0, 0)
const RY = new Operation("RY", 1, 1, 0, 0)
const RYY = new Operation("RYY", 2, 1, 0, 0)
const RZ = new Operation("RZ", 1, 1, 0, 0)
const RZZ = new Operation("RZZ", 2, 1, 0, 0)
const RZX = new Operation("RZZ", 2, 1, 0, 0)
const SWAP = new Operation("SWAP", 2, 0, 0, 0)
const ISWAP = new Operation("ISWAP", 2, 0, 0, 0)


// other instructions
const BARRIER = new Operation("Barrier", -1)
const MEASURE = new Operation("Measure", 1, 0, 1)

let importantGatesMap = {
    "h": H,
    "x": X,
    "y": Y,
    "z": Z,
    "i": I,
    "s": S,    
    "t": T,      
    "u1": U1,
    "u2": U2,
    "u3": U3,
    "swap": SWAP,
    "rx": RXX,
    "rz": RZ,
    "ry": RY,
    "phase": PHASE,
    "cu1": CU1,
    "cu3": CU3,
    "cx": CX,
    "cy": CY,
    "cz": CZ,
    "crx": CRX,
    "cry": CRY,
    "crz": CRZ,
    "cphase": CPHASE,    
    "barrier": BARRIER,
    "measure": MEASURE
}

export let gateMap = {
    "u": U,
    "sx": SX,
    "sxdg": SXDG,
    "sdg": SDG,
    "tdg": TDG,  
    "ccx": CCX,
    "c3x": C3X,
    "c4x": C4X,
    "dcx": DCX,
    "ch": CH,
    "cswap": CSWAP,
    "csx": CSX,
    "cu": CU,   
    "ms": MS,
    "rccx": RCCX,
    "rc3x": RC3X,    
    "rxx": RXX,    
    "ryy": RYY,    
    "rzz": RZZ,
    "rzx": RZX,
    "iswap": ISWAP,
}

for (let key in importantGatesMap) {
    gateMap[key] = importantGatesMap[key];
} 

export let importantGatesList = [];
for (let key in importantGatesMap) {
    importantGatesList.push(importantGatesMap[key]);
}

