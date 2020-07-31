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
  circuit: string = "test"; 
  editorOptions = {theme: 'vs-light', language: 'python', automaticLayout: true};

  constructor() { }

  ngOnInit(): void {
  }

  changed(event: MatSelectChange) {
    console.log(event)
    this.selectedOption = event.value
  }

  inputFile() {
    document.getElementById('fileInput').addEventListener('change', this.readFile.bind(this), false);
    document.getElementById('fileInput').click()

  }

  readFile(event: any) {

    console.log(this.circuit)

    let file = event.target.files[0]; // FileList object
    console.log(file)

    let extension = file.name.split('.').pop()
    console.log(extension)

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // when the reader is done, the content is in reader.result.
      this.circuit = reader.result;
      console.log(this.circuit);

    }.bind(this);

    reader.readAsText(file);
  }

}
