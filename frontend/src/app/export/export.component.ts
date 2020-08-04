import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {  
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]
  selectedOption: string;
  
  constructor(private http: HttpService) { }

  ngOnInit(): void {
  }

  changed(event: MatSelectChange) {
    console.log(event)
    this.selectedOption = event.value
  }

  async computeExport() {
    if (!(this.options.includes(this.selectedOption))) {
      this.snackbar.open("You must choose an input language/framework.");
      return
    }

    let object = {
      "option": this.selectedOption,
      "circuit": this.circuit
    }
    let circuit = await this.http.circuit_to_internal(object)
    if (circuit) {
      this.data.circuit = circuit
    }    
  }

}
