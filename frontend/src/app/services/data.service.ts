import { Injectable } from '@angular/core';
import { Operation, operationMap, OperationIndex } from './Operation';
import { MatSelectChange } from '@angular/material/select';
import { element } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
  public inputFormat: string = "";
  public exportFormat: string = "";

  public circuits: { [id: string]: string; } = {
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
//       `qc = QuantumCircuit(5,3)
// qc.h(0)
// qc.x(0)
// qc.y(0)
// `,
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
    "export": ""
  }
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

  public operationsAtBit: OperationIndex[][] = [];
  public firstOperationAt: number = 0;

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
    let operationsAtBit = [];
    let firstOperationAt = -1;
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

        for (let i = 0; i < numBits; i++) {
          operationsAtBit.push([]);
        }

      } else if (line.includes("qc.")) {
        if (firstOperationAt == -1) {
          firstOperationAt = lineNumber;
        }
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
        let placeholder = new OperationIndex(maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers, true)
        // fill operations at index
        qubits.forEach(qubit => {
          if (lastIndex > operationsAtBit[qubit].length - 1) {
            for (let i = operationsAtBit[qubit].length; i <= lastIndex; i++) {
              operationsAtBit[qubit].push(placeholder)
            }
          }
          operationsAtBit[qubit][lastIndex] = operationIndex;
        })
      }
    })
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
    this.operationsAtBit = operationsAtBit;
    this.firstOperationAt = firstOperationAt;
  }

  moveOperation(qubitIndex: number, previousIndex: number, currentIndex: number) {
    let operationIndex = this.operationsAtBit[qubitIndex][previousIndex];
    // remove
    let lineNumbersRemove = operationIndex.lineNumbersInCircuit;
    let lines = this.circuits["internal"].split('\n');
    lineNumbersRemove.forEach(lineNumber => {
      lines.splice(lineNumber, 1);
    })
    // add
    let lineToInsert: number = this.firstOperationAt;
    if (this.operationsAtBit[qubitIndex].length > 0) {
      let lineNumbersInCircuit = this.operationsAtBit[qubitIndex][currentIndex].lineNumbersInCircuit
      // get last line number + 1
      if (previousIndex < currentIndex) {
        lineToInsert = lineNumbersInCircuit[lineNumbersInCircuit.length - 1] + 1
        // first line number
      } else {
        lineToInsert = lineNumbersInCircuit[0]
      }
    }


    if (lineNumbersRemove[0] < lineToInsert) {
      lineToInsert -= lineNumbersRemove.length
    }

    lines.splice(lineToInsert, 0, `qc.${operationIndex.operation.name.toLowerCase()}(${this.listToString(operationIndex.qubits)}${this.commaNeeded(operationIndex)}${this.listToString(operationIndex.parameter)})`);
    this.circuits["internal"] = lines.join('\n');
    this.parseCircuit()
  }

  removeOperation(index: number, qubitIndex: number) {
    let operation = this.operationsAtBit[qubitIndex][index];
    let lineNumbers = operation.lineNumbersInCircuit;
    let lines = this.circuits["internal"].split('\n');
    lineNumbers.forEach(lineNumber => {
      lines.splice(lineNumber, 1);
    })
    this.circuits["internal"] = lines.join('\n');
    this.parseCircuit()
  }

  addOperation(operationIndex: OperationIndex, index: number, qubitIndex: number) {
    let lines = this.circuits["internal"].split('\n');
    let lineToInsert: number = this.firstOperationAt;
    if (this.operationsAtBit[qubitIndex].length > 0) {
      let lineNumbersInCircuit = this.operationsAtBit[qubitIndex][index].lineNumbersInCircuit
      lineToInsert = lineNumbersInCircuit[0];
    }
    lines.splice(lineToInsert + 1, 0, `qc.${operationIndex.operation.name.toLowerCase()}(${this.listToString(operationIndex.qubits)}${this.commaNeeded(operationIndex)}${this.listToString(operationIndex.parameter)})`);
    this.circuits["internal"] = lines.join('\n');
    this.parseCircuit()
  }

  private listToString(list: any[]): string {
    let string: string = "";
    for (let i = 0; i < list.length; i++) {
      if (i < list.length - 1) {
        string += list[i] + ","
      } else {
        string += list[i]
      }
    }
    return string;
  }

  private commaNeeded(operationIndex: OperationIndex): string {
    let qubits = operationIndex.qubits;
    let parameter = operationIndex.parameter;
    let string = "";
    if ((qubits.length > 0) && parameter.length > 0) {
      string = ","
    }
    return string;
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
