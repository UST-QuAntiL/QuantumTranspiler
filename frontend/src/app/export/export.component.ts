import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../services/http.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExportComponent implements OnInit {  
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]
  selectedOption: string;

  constructor(private http: HttpService, private snackbar: MatSnackBar, private data: DataService) { }

  ngOnInit(): void {
  }

  changed(event: MatSelectChange) {
    console.log(event)
    this.selectedOption = event.value
  }

  async computeExport() {
    if (!(this.options.includes(this.selectedOption))) {
      this.snackbar.open("You must choose an output language/framework.");
      return
    }

    let object = {
      "option": this.selectedOption,
      "circuit": this.data.getCircuit("current")
    }
    let circuit = await this.http.exportCircuit(object)
    if (circuit) {
      this.data.setExportCircuit(circuit, this.selectedOption)
    }    
  }

}
