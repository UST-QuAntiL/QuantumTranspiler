import { Injectable } from '@angular/core';
import { Operation, operationMap, OperationIndex } from './Operation';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public exportCircuit: string = "";
  public exportFormat: string = "";


  public circuit: string = `
qc = QuantumCircuit(5,3)
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
qc.measure(2, 2)
  `;

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


  public setCircuit(circuit: string) {
    this.circuit = circuit;
    this.parseCircuit()
  }


  parseCircuit() {
    // clean up
    this.numQbits = 0;
    this.numClbits = 0;
    this.numBits = 0;
    this.maxIndexTotal = 0;
    this.qubitNames = [];
    this.clbitNames = [];
    this.bitNames = [];
    this.currentIndexQ = Array(this.numQbits).fill(-1);
    this.currentIndexCl = Array(this.numQbits).fill(-1);
    this.operationsAtIndex = [];
    this.operationsAtBit = [];


    let arrayOfLines = this.circuit.split("\n");
    arrayOfLines.forEach((line, lineNumber) => {
      if (line.includes("QuantumCircuit")) {
        let afterBracket = line.split("(")[1].replace(")", "");
        let numbers = afterBracket.split(",")
        this.numQbits = parseInt(numbers[0].trim())
        if (numbers.length > 1) {
          this.numClbits = parseInt(numbers[1].trim())
        }
        // TODO handle imports via registers
        let qubitNames = []
        for (let i = 0; i < this.numQbits; i++) {
          qubitNames.push(i)
        }
        this.qubitNames = qubitNames;

        let clbitNames = []
        for (let i = 0; i < this.numClbits; i++) {
          clbitNames.push(i)
        }
        this.clbitNames = clbitNames;
        this.bitNames = this.qubitNames.concat(this.clbitNames)
        this.numBits = this.numQbits + this.numClbits;

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
          if (this.currentIndexQ[qubit] > maxIndex) {
            maxIndex = this.currentIndexQ[qubit]
          }
        })
        clbits.forEach(clbit => {
          if (this.currentIndexQ[clbit] > maxIndex) {
            maxIndex = this.currentIndexQ[clbit]
          }
        })
        let lastIndex = maxIndex;
        maxIndex += 1;
        if (maxIndex > this.maxIndexTotal) {
          this.maxIndexTotal = maxIndex;
        }
        // set max index in arrays
        qubits.forEach(qubit => {
          this.currentIndexQ[qubit] = maxIndex
        })
        clbits.forEach(clbit => {
          this.currentIndexQ[clbit] = maxIndex
        })
        let lineNumbers = [lineNumber]
        let operationIndex = new OperationIndex(maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers)
        if (maxIndex > this.operationsAtIndex.length) {
          this.operationsAtIndex[lastIndex] = Array(this.numBits).fill(null)
        }


        // fill operations at index
        qubits.forEach(qubit => {
          this.operationsAtIndex[lastIndex][qubit] = operationIndex;
        })
      }
    })

    let operationsAtBit =[];

    for (let qubit_index = 0; qubit_index < this.numBits; qubit_index++) {
      operationsAtBit.push([])
      for (let index = 0; index < this.maxIndexTotal; index++) {
        operationsAtBit[qubit_index].push(this.operationsAtIndex[index][qubit_index])      
      } 
    }
    this.operationsAtBit = operationsAtBit; 

  }

  removeOperation(index, qubit_index) {
    let operation = this.operationsAtIndex[index][qubit_index];
    console.log(operation)
    let lineNumbers = operation.lineNumberInCircuit;
    console.log(lineNumbers)
    let lines = this.circuit.split('\n');
    lineNumbers.forEach(lineNumber => {
      lines.splice(lineNumber, 1);
    })

    this.circuit = lines.join('\n');
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
    this.exportCircuit = circuit;
    this.exportFormat = format;
  }
}
