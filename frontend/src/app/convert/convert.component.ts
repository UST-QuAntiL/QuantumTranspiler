import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { InputComponent } from '../input/input.component';
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit {
  @ViewChild(InputComponent) child:InputComponent;
  selectedOption: string;
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]

  constructor(public data: DataService) { }

  ngOnInit(): void {
  }

  async computeInternal() {
    this.child.computeInternal()
  }

  async changedInput(event: MatSelectChange) {
    this.child.changedInput(event)
  }
}
