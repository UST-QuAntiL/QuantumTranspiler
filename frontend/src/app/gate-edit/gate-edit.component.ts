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

  change() {
    console.log(this.gate)
    this.data.editOperation(this.gate)
  }
  
}
