import { Injectable } from '@angular/core';
import { Operation, operationMap, OperationIndex } from './Operation';
import { MatSelectChange } from '@angular/material/select';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
  public inputFormat: string = "";
  public exportFormat: string = "";

  public circuits: { [id: string] : string; } = {
    "import": 
`DECLARE ro BIT[3]
H 0
H 1
H 2
H 1
CNOT 2 3
CPHASE (0) 1 0
CNOT 2 4
H 0
CPHASE (0) 1 2
CPHASE (0) 0 2
H 2
MEASURE 0 ro[0]
MEASURE 1 ro[1]
MEASURE 2 ro[2]
`,
    "internal": 
`qc = QuantumCircuit(5,3)
qc.h(0)
qc.h(1)
qc.h(2)
qc.h(1)
qc.cx(2, 3)
qc.cu1(0, 1, 0)
qc.cx(2, 4)
qc.h(0)
qc.cu1(0, 1, 2)
qc.cu1(0, 0, 2)
qc.h(2)
qc.measure(0, 0)
qc.measure(1, 1)
qc.measure(2, 2)`,
"unroll": "",
"export": ""}
;

  public numQbits: number = 0;
  public numClbits: number = 0;
  public numBits: number = 0;
  public qubitNames: string[] = [];
  public clbitNames: string[] = [];
  public bitNames: string[] = [];
  public maxIndexTotal: number = 0;
  public currentIndexQ = Array(this.numQbits).fill(-1);
  public currentIndexCl = Array(this.numQbits).fill(-1);

  public operationsAtIndex: OperationIndex[][] = [];
  public operationsAtBit: OperationIndex[][] = [];


  constructor() {
    this.parseCircuit()
  }


  public setCircuit(index: string, circuit: string) {
    this.circuits[index] = circuit;
    if (index == "internal") {
      this.parseCircuit()
    }    
  }

  public setCircuitOnWrite(circuitRef: string, circuit: string) {
    try {
      this.setCircuit(circuitRef, circuit);
    } catch (e) {
      // happens when a user is changing the circuit (and data is just partly changed), but should not happen otherwise
      console.log("Circuit data cannot be parsed.")
      // console.log(e)
    }
    
  }


  parseCircuit() {    
    // temp variables
    let numQbits = 0;
    let numClbits = 0;
    let numBits = 0;
    let maxIndexTotal = 0;
    let qubitNames = [];
    let clbitNames = [];
    let bitNames = [];
    let currentIndexQ = Array(this.numQbits).fill(-1);
    let currentIndexCl = Array(this.numQbits).fill(-1);
    let operationsAtIndex = [];
    let operationsAtBit = [];

    let circuit = this.circuits["internal"]
    let arrayOfLines = circuit.split("\n");
    arrayOfLines.forEach((line, lineNumber) => {
      if (line.includes("QuantumCircuit")) {
        let afterBracket = line.split("(")[1].replace(")", "");
        let numbers = afterBracket.split(",")
        numQbits = parseInt(numbers[0].trim())
        if (numbers.length > 1) {
         numClbits = parseInt(numbers[1].trim())
        }
        // TODO handle imports via registers
        for (let i = 0; i < numQbits; i++) {
          qubitNames.push(i)
        }        

        let clbitNames = []
        for (let i = 0; i < numClbits; i++) {
          clbitNames.push(i)
        }
        bitNames = qubitNames.concat(clbitNames)
        numBits = numQbits + numClbits;

      } else if (line.includes("qc.")) {
        let lineTrimmed = line.replace(/qc./g, "").trim();
        let lineSplitted = lineTrimmed.split("(");
        let operationString = lineSplitted[0];
        let parameters = lineSplitted[1].replace(")", "").split(",");
        let operation = operationMap[operationString];

        let paramsWithoutBits = []
        let qubits = []
        let clbits = []
        for (let i = 0; i < operation.numberOfParameter; i++) {
          paramsWithoutBits.push(parameters[i].trim())
        }
        for (let i = operation.numberOfParameter; i < (operation.numberOfParameter + operation.numberOfQubits); i++) {
          qubits.push(parameters[i].trim())
        }
        for (let i = operation.numberOfParameter + operation.numberOfQubits; i < (operation.numberOfParameter + operation.numberOfQubits + operation.numberOfClbits); i++) {
          clbits.push(parameters[i].trim())
        }

        // compute max index
        let maxIndex = 0;
        qubits.forEach(qubit => {
          if (currentIndexQ[qubit] > maxIndex) {
            maxIndex = currentIndexQ[qubit]
          }
        })
        clbits.forEach(clbit => {
          if (currentIndexQ[clbit] > maxIndex) {
            maxIndex = currentIndexQ[clbit]
          }
        })
        let lastIndex = maxIndex;
        maxIndex += 1;
        if (maxIndex > maxIndexTotal) {
          maxIndexTotal = maxIndex;
        }
        // set max index in arrays
        qubits.forEach(qubit => {
          currentIndexQ[qubit] = maxIndex
        })
        clbits.forEach(clbit => {
          currentIndexQ[clbit] = maxIndex
        })
        let lineNumbers = [lineNumber]
        let operationIndex = new OperationIndex(maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers)
        if (maxIndex > operationsAtIndex.length) {
          operationsAtIndex[lastIndex] = Array(numBits).fill(null)
        }


        // fill operations at index
        qubits.forEach(qubit => {
          operationsAtIndex[lastIndex][qubit] = operationIndex;
        })
      }
    })

    for (let qubit_index = 0; qubit_index < numBits; qubit_index++) {
      operationsAtBit.push([])
      for (let index = 0; index < maxIndexTotal; index++) {
        operationsAtBit[qubit_index].push(operationsAtIndex[index][qubit_index])
      }
    }
    // at the end if parsing errors occur, the data is not written partly
    this.numQbits = numQbits;
    this.numClbits = numClbits;
    this.numBits = numBits;
    this.maxIndexTotal = maxIndexTotal;
    this.qubitNames = qubitNames;
    this.clbitNames = clbitNames;
    this.bitNames = bitNames;
    this.currentIndexQ = currentIndexQ;
    this.currentIndexCl = currentIndexCl;
    this.operationsAtIndex = operationsAtIndex;
    this.operationsAtBit = operationsAtBit;
  }

  removeOperation(index, qubit_index) {
    let operation = this.operationsAtIndex[index][qubit_index];
    console.log(operation)
    let lineNumbers = operation.lineNumberInCircuit;
    console.log(lineNumbers)
    let lines = this.circuits["internal"].split('\n');
    lineNumbers.forEach(lineNumber => {
      lines.splice(lineNumber, 1);
    })

    this.circuits["internal"] = lines.join('\n');
    this.parseCircuit()

    // let operation: OperationIndex = this.operationsAtIndex[index][qubit_index];
    // this.operationsAtIndex[index][qubit_index] = null;

    // operation.qubits.forEach(qubit => {
    //   if (this.currentIndexQ[qubit] == this.maxIndexTotal) {
    //     this.currentIndexQ[qubit]--;
    //   }
    // });

    // this.setMaxIndex()
  }

  setMaxIndex() {
    let max = -1;
    this.currentIndexQ.forEach(index => {
      if (index > max) {
        max = index;
      }
    })
    this.currentIndexCl.forEach(index => {
      if (index > max) {
        max = index;
      }
    })

    this.maxIndexTotal = max;
  }

  setExportCircuit(circuit: string, format: string) {
    this.setCircuit("export", circuit);
    this.exportFormat = format;
  }

  getCircuit(circuitRef: string) {
    if (circuitRef == "current") {
      if (this.circuits["unroll"] != "") {
        return this.circuits["unroll"];
      }
      return this.circuits["internal"];   
    } 
    return this.circuits[circuitRef]

  }

  public changedInput(event: MatSelectChange) {
    this.inputFormat = event.value;
  }

  public changedExport(event: MatSelectChange) {
    this.exportFormat = event.value;
  }
}
