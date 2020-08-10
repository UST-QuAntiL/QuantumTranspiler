import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { editorOptions } from '../services/Options';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  @Input() circuitRef: string;

  editorOptions = editorOptions;
 

  constructor(public data: DataService) {   
    console.log(this.circuitRef)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onChange() {
    this.data.parseCircuit()
  }

}
