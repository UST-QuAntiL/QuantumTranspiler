import { Injectable } from '@angular/core';
import { Operation, OperationMap } from './Operation';


@Injectable({
  providedIn: 'root'
})
export class DataService {
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
  public operations: Operation[] = [ ]

  constructor() {
    this.parseCircuit()
  }


  parseCircuit() {
    let currentIndex: number[]
    let operations: Operation[] = []
    let arrayOfLines = this.circuit.split("\n");
    console.log(arrayOfLines) 
    arrayOfLines.forEach(line => {
      console.log(line)

      if (line.includes("QuantumCircuit")) {
        let afterBracket = line.split("(")[1].replace(")", "");
        let numbers = afterBracket.split(",")
        this.numQbits = parseInt(numbers[0].trim()) 
        if (numbers.length > 1) {
          this.numClbits = parseInt(numbers[1].trim())
        }
        console.log(this.numQbits)
        currentIndex = Array(this.numQbits + this.numClbits).fill(0);
        // TODO handle imports via registers
        
      } else if (line.includes("qc.")) {
        let lineTrimmed = line.replace(/qc./g, "").trim();
        let lineSplitted = lineTrimmed.split("(");
        let operationString = lineSplitted[0];
        let parameters = lineSplitted[1].replace(")", "");


        let operation = OperationMap[operationString]

        // operations.append()
        console.log(operation)
      }
    })
    this.operations = operations;
    
  }
}
