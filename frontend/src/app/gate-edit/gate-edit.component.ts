import { Component, OnInit, Input } from '@angular/core';
import { OperationIndex } from '../services/Operation';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gate-edit',
  templateUrl: './gate-edit.component.html',
  styleUrls: ['./gate-edit.component.scss']
})
export class GateEditComponent implements OnInit {
  @Input() gate: OperationIndex;
  constructor(private data: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  editedParameter(index: number, event: any) {
    if (this.isNumber(event)) {
      this.gate.parameter[index] = event;
      this.data.editOperation(this.gate);
    } else {
      this.snackbar.open("No valid value selected.");
    }    
  }

  editedQubit(index: number, event: any) {    
    if (this.isNumber(event)) {
      this.gate.qubits[index] = event;
      this.data.editOperation(this.gate);
    } else {
      this.snackbar.open("No valid value selected.");
    }  
  }

  editedClbit(index: number, event: any) {
    if (this.isNumber(event)) {
      this.gate.clbits[index] = event;
      this.data.editOperation(this.gate);
    } else {
      this.snackbar.open("No valid value selected.");
    }  
  }

  isNumber(number) {
    if (number === "") {
      return false;
    }
    return !isNaN(number)  
  }
}
