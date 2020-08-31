import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList, OperationIndex, operationMap } from '../services/Operation';
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
  public operationList: Operation[] = operationList;;
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
        console.log(event.previousIndex)
        return;
      }
      let qubitIndex: number = parseInt(event.container.id);
      this.data.moveOperation(qubitIndex, event.previousIndex, event.currentIndex);
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
      let operation: Operation = operationMap[event.item.element.nativeElement.id.toLowerCase()]
      if (operation.numberOfQubits > 1 || operation.numberOfParameter > 0 || operation.numberOfClbits > 0) {
        this.openBottomSheet(operation, qubitIndex, index)
      } else {
        let operationIndex: OperationIndex = new OperationIndex(index , operation, [], [qubitIndex], [], [this.data.getLinesToInsert(index, qubitIndex)])
        this.data.addOperationIndex(operationIndex)
      }     

    } else {
      // transferArrayItem(event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex);
    }
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
        let operationIndex: OperationIndex = new OperationIndex(index , operation, params, qubits, clbits, [this.data.getLinesToInsert(index, qubits[0])]);
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

  private async computeGateConnections() {
    // hacky solution: without delay the new elements with their new coordinates might not be in the view
    await delay(10)
    let lineList: ConnectorAttributes[] = [];
    this.data.operationsAtBit.forEach((operationsAtIndex, qubitIndex) => {
      operationsAtIndex.forEach((operation: OperationIndex, index) => {
        if (!operation.placeholder && !operation.control) {
          if (operation.operation.numberOfQubits > 1) {
            let line = new ConnectorAttributes()
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
            lineList.push(line)
          }
        }

      })
    })
    this.lineList = lineList;
    this.cdRef.detectChanges()

  }

  public setStyle(line: ConnectorAttributes) {
    let styles = {
      'top': line.yTop + "px",
      'left': line.xLeft + "px",
      // "right": line.xRight,
      // "bottom": line.yBot,
      "width": line.getWidth() + "px",
      "height": line.getHeight() + "px",
      // 'display': 'none'
    };
    return styles;
  }

  edit(operationIndex: OperationIndex) {
    this.oldSelectedGate = operationIndex;
    this.showGate(operationIndex)
  }

  onMouseEnter(operationIndex: OperationIndex) {
    if (!this.oldSelectedGate) {
      this.showGate(operationIndex);
    }
  }

  showGate(operationIndex: OperationIndex) {
    this.data.highlightLines.next(this.getLineNumbersIncreasedByOne(operationIndex))
    this.selectedGate = operationIndex;
    this.isGateSelected = true;
  }

  onMouseLeave() {
    if (this.oldSelectedGate) {
      this.showGate(this.oldSelectedGate);
    }
  }
}
