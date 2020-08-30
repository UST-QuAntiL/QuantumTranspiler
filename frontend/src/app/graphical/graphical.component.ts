import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList, OperationIndex } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpService } from '../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DOCUMENT } from '@angular/common';
import { ConnectorAttributes, delay } from '../services/Utility'

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit, AfterViewInit {
  public operationList: Operation[] = operationList;;
  public lineList: ConnectorAttributes[] = [];

  constructor(public data: DataService, private http: HttpService, private _elementRef: ElementRef, private snackbar: MatSnackBar, @Inject(DOCUMENT) document, private cdRef: ChangeDetectorRef) {
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
    if (event.previousContainer === event.container) {
      if ((event.container.id === "gateList") || event.previousIndex == event.currentIndex) {
        return;
      }
      let qubitIndex: number = parseInt(event.container.id);
      this.data.moveOperation(qubitIndex, event.previousIndex, event.currentIndex);

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
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

  

}
