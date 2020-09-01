import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, importantGatesList, OperationIndex, gateMap } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpService } from '../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DOCUMENT } from '@angular/common';
import { ConnectorAttributes, delay } from '../services/Utility'
import { BehaviorSubject } from 'rxjs';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit, AfterViewInit {
  public importantGatesList: Operation[] = importantGatesList;;
  public lineList: ConnectorAttributes[] = [];
  public isGateSelected: boolean = false;
  public selectedGate: OperationIndex;
  public oldSelectedGate: OperationIndex;

  constructor(public data: DataService, private http: HttpService, private _elementRef: ElementRef, private snackbar: MatSnackBar, @Inject(DOCUMENT) document, private cdRef: ChangeDetectorRef, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.data.circuitChanged.subscribe(value => {
      this.cdRef.detectChanges();
      if (value) {
        this.computeGateConnections()
      }
    })
  }

  drop(event: CdkDragDrop<OperationIndex[]>) {
    // change position of gate    
    if (event.previousContainer === event.container) {
      if ((event.container.id === "gateList") || event.previousIndex == event.currentIndex) {
        return;
      }
      this.moveOperation(event)
      // remove gate
    } else if (event.container.id === "gateList") {
      let id: string = event.item.element.nativeElement.id;
      let indices = id.split("-");
      let qubitIndex = parseInt(indices[0])
      let index = parseInt(indices[1])
      this.data.removeOperationAtIndex(index, qubitIndex)
      // add new gate
    } else if (event.previousContainer.id === "gateList") {
      let qubitIndex: number = parseInt(event.container.id);
      let index: number = event.currentIndex;
      let operation: Operation = gateMap[event.item.element.nativeElement.id.toLowerCase()]
      if (operation.numberOfQubits > 1 || operation.numberOfParameter > 0 || operation.numberOfClbits > 0) {
        this.openBottomSheet(operation, qubitIndex, index)
      } else {
        let operationIndex: OperationIndex = new OperationIndex(index, operation, [], [qubitIndex], [], [this.data.getLinesToInsert(index, qubitIndex)])
        this.data.addOperationIndex(operationIndex)
      }
      // change qubitIndex and possibly index of gate
    } else {
      this.moveOperation(event)
    }
  }

  moveOperation(event: CdkDragDrop<OperationIndex[]>) {
    let newQubitIndex: number = parseInt(event.container.id);
    let newIndex: number = event.currentIndex;
    let id: string = event.item.element.nativeElement.id;
    let indices = id.split("-");
    let qubitIndex = parseInt(indices[0])
    let index = parseInt(indices[1])
    let operationIndex: OperationIndex = this.data.operationsAtBit[qubitIndex][index];

    let linesToRemove: number[] = null;
    // change index
    if (index != newIndex) {
      linesToRemove = operationIndex.lineNumbersInCircuit
      operationIndex.lineNumbersInCircuit = [this.data.getLinesToInsertEvent(index, newIndex, newQubitIndex)];
    }
    // change qubit 
    for (let i = 0; i < operationIndex.qubits.length; i++) {
      if (operationIndex.qubits[i] == qubitIndex) {
        operationIndex.qubits[i] = newQubitIndex
      }
    }
    // change clbit
    // subtract number of qubits to the get clbit references
    let clbitIndex = qubitIndex - this.data.qubitNames.length
    let newClbitIndex = newQubitIndex - this.data.qubitNames.length
    for (let i = 0; i < operationIndex.clbits.length; i++) {
      if ((operationIndex.clbits[i]) == clbitIndex) {
        operationIndex.clbits[i] = newClbitIndex
      }
    }
    this.data.editOperation(operationIndex, linesToRemove);
  }

  openBottomSheet(operation: Operation, qubitIndex: number, index: number): void {
    let qubits = [qubitIndex].concat(operation.generateList(operation.numberOfQubits - 1))
    let params = operation.generateList(operation.numberOfParameter)
    let clbits = operation.generateList(operation.numberOfClbits)
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: { qubits: qubits, params: params, clbits: clbits },
    });

    bottomSheetRef.afterDismissed().subscribe((data) => {
      if (data) {
        let qubits = data.qubits;
        let params = data.params;
        let clbits = data.clbits;
        let operationIndex: OperationIndex = new OperationIndex(index, operation, params, qubits, clbits, [this.data.getLinesToInsert(index, qubits[0])]);
        this.data.addOperationIndex(operationIndex)
      }
    });

  }

  private getLineNumbersIncreasedByOne(operationIndex: OperationIndex) {
    let lineNumbers = []
    operationIndex.lineNumbersInCircuit.forEach(element => {
      lineNumbers.push(element + 1)
    })
    return lineNumbers;
  }

  public getTooltip(operationIndex: OperationIndex) {
    let lineNumbers = this.getLineNumbersIncreasedByOne(operationIndex);
    let tooltip = `Lines in code: ${this.getLineNumbersIncreasedByOne(operationIndex)}`;
    if (operationIndex.parameter.length > 0) {
      tooltip += `\nParameter: ${operationIndex.parameter}`
    }
    return tooltip;
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:scroll', ['$event'])
  recomputeGateConnections(event) {
    this.computeGateConnections()
  }

  private async computeGateConnections() {
    // hacky solution: without delay the new elements with their new coordinates might not be in the view
    await delay(10)

    let lineList: ConnectorAttributes[] = [];
    let circuitElement = document.getElementById(`circuit`)
    if (circuitElement == null) {
      return;
    }
    let circuitLeft = circuitElement.getClientRects()[0].x
    let circuitRight = circuitElement.getClientRects()[0].x + circuitElement.getClientRects()[0].width;

    this.data.operationsAtBit.forEach((operationsAtIndex, qubitIndex) => {
      for (let index = 0; index < operationsAtIndex.length; index++) {
        let operation: OperationIndex = operationsAtIndex[index]
        let line = new ConnectorAttributes()
        // operationsAtIndex.forEach((operation: OperationIndex, index) => {
        if (!operation.placeholder && !operation.control) {
          if (operation.operation.numberOfQubits > 1) {            
            operation.qubits.forEach(qubit => {
              let element = document.getElementById(`${qubit}-${index}`)
              if (element == null) {
                return;
              }
              let rects = element.getClientRects()[0]
              let xLeft = rects.x;
              let xRight = rects.x + rects.width;
              let yTop = rects.y
              let yBot = rects.y + rects.height
              line.setYTop(yTop)
              line.setYBot(yBot)
              line.setYLeft(xLeft)
              line.setXRight(xRight)
            })
            
            
          } else if (operation.operation.numberOfClbits > 0) {   
            line.measure = true;         
            let element = document.getElementById(`${operation.qubits[0]}-${index}`)
            let element2 = document.getElementById(`${operation.clbits[0] + this.data.qubitNames.length}-${index}`)
            if (element == null || element2 == null) {
              return;
            }
            let rects = element.getClientRects()[0]
            let rects2 = element2.getClientRects()[0]
            line.setYTop(rects.y)
            line.setYBot(rects2.y + rects2.height)
            line.setYLeft(rects.x)
            line.setXRight(rects.x + rects.width)
          }
          if (line.xLeft < circuitLeft) {
            continue;
          }
          if (line.xRight > circuitRight) {
            continue;
          }
          lineList.push(line)
        }

      }
    })
    this.lineList = lineList;
    this.cdRef.detectChanges();
  }

  public setStyle(line: ConnectorAttributes) {
    let styles = {
      'top': line.yTop + "px",
      'left': line.xLeft + "px",
      "width": line.getWidth() + "px",
      "height": line.getHeight() + "px",
    };

    if (line.measure) {
      styles['background-image'] = "linear-gradient(to bottom right, #4b830d, #aee571)"
      styles['opacity'] = "15%"
    } else {
      styles['background-image'] = "linear-gradient(to bottom right, #005cb2, #6ab7ff)"
    }

    return styles;
  }

  edit(operationIndex: OperationIndex) {
    this.oldSelectedGate = operationIndex;
    this.showGate(operationIndex)
  }

  onMouseEnter(operationIndex: OperationIndex) {
    //recompute gate connections because of new elements on site that can change the layout
    this.computeGateConnections()
    this.highlightLines(operationIndex)
    if (!this.oldSelectedGate) {
      this.showGate(operationIndex);
    }
  }

  showGate(operationIndex: OperationIndex) {
    this.highlightLines(operationIndex)
    this.selectedGate = operationIndex;
    this.isGateSelected = true;
  }

  private highlightLines(operationIndex: OperationIndex) {
    this.data.highlightLines.next(this.getLineNumbersIncreasedByOne(operationIndex))
  }

  onMouseLeave() {
    if (this.oldSelectedGate) {
      this.showGate(this.oldSelectedGate);
    }
  }
}
