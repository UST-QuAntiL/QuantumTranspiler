import { Component, OnInit } from '@angular/core';
import { operationMap } from '../services/Operation';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-unroll',
  templateUrl: './unroll.component.html',
  styleUrls: ['./unroll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnrollComponent implements OnInit {
  selectedGates = [];
  operationMap = operationMap;
  chooseRigetti = false;
  chooseIBMQ = false;
  chooseNative = false;
  constructor() { }

  ngOnInit(): void {
  }

  deselect() {
    this.chooseIBMQ = false;
    this.chooseRigetti = false;
    this.chooseNative = false; 

  }

}
