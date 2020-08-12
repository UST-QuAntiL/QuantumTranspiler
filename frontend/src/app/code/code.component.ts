import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  @Input() circuitRef: string;

  editorOptions = {
    theme: 'vs-light', language: 'python', automaticLayout: true, scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: 'hidden',
        horizontal: 'hidden',

        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 17,
        arrowSize: 30
    }
};;
 

  constructor(public data: DataService) {  
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onChange(circuit: string) {
    this.data.setCircuitOnWrite(this.circuitRef, circuit)
  }

}
