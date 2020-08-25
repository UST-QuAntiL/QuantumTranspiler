import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList, OperationIndex } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpService } from '../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit { 
  public operationList: Operation[] = operationList;;
  

  constructor(public data: DataService, private http: HttpService, private _elementRef : ElementRef, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {

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
  
}
