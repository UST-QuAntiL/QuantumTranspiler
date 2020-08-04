import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { editorOptions } from '../services/Options';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  editorOptions = editorOptions;
 

  constructor(public data: DataService) {   

   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onChange() {
    this.data.parseCircuit()
  }

}
