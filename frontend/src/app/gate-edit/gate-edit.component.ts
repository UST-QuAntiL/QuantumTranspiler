import { Component, OnInit, Input } from '@angular/core';
import { OperationIndex } from '../services/Operation';

@Component({
  selector: 'app-gate-edit',
  templateUrl: './gate-edit.component.html',
  styleUrls: ['./gate-edit.component.scss']
})
export class GateEditComponent implements OnInit {
  @Input() gate: OperationIndex;
  constructor() { }

  ngOnInit(): void {
  }

}
