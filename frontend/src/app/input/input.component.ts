import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit {
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]
  selectedOption: string;
  circuit: string = `DECLARE ro BIT[3]
H 0
H 1
H 2
H 1
CNOT 2 3
CPHASE (0) 1 0
CNOT 2 4
H 0
CPHASE (0) 1 2
CPHASE (0) 0 2
H 2
MEASURE 0 ro[0]
MEASURE 1 ro[1]
MEASURE 2 ro[2]
`
  editorOptions = { theme: 'vs-light', language: 'python', automaticLayout: true };

  constructor(private http: HttpService) { }

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

  async computeInternal() {
    let object = {
      "option": this.selectedOption,
      "circuit": this.circuit
    }
    await this.http.circuit_to_internal(object)

  }

}
