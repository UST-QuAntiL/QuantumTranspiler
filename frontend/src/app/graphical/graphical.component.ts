import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit {
  public operationList: Operation[] = operationList;
  public secondList: Operation[] = [];
;

  constructor(public data: DataService) {
    const H = new Operation("H")
    const CX = new Operation("CX", 2)
    this.secondList.push(H)
    this.secondList.push(CX)
  }

  createCircuit() {
    
  }

  ngOnInit(): void {
    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
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
