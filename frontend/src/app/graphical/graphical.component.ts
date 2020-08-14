import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList, OperationIndex } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit {
  public operationList: Operation[] = operationList;;

  constructor(public data: DataService) {
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

  // drop(event: CdkDragDrop<any>) {
  //   console.log("drop event")
  //   console.log(event)
  //   if (event.previousContainer.id === event.container.id) {
  //     console.log("he")
  //     // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   }
    
  //   // if (event.item.data) {
  //   //   let data = event.item.data
  //   //   console.log(event.item.data)
  //   //   this.data.removeOperation(data[0], data[1]);
  //   //   // this.data.operationsAtIndex[data[0]][data[1]] = null;
  //   // }
    
  // }
  



}
