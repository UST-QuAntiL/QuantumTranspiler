import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit {
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]
  selectedOption: string;
  constructor() { }

  ngOnInit(): void {
  }

  changed(event: MatSelectChange) {
    console.log(event)
    this.selectedOption = event.value
  }

  inputFile() {
    document.getElementById('fileInput').click()
  }

}
