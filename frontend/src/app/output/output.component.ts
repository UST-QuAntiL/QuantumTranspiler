import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { saveAs } from "file-saver";
import { MatSnackBar } from '@angular/material/snack-bar';
import { editorOptions } from '../services/Options';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OutputComponent implements OnInit {
  editorOptions = editorOptions;

  
  constructor(public data: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  download() {
    if (this.data.circuits[2] === "") {
      this.snackbar.open("Circuit is empty.");
      return;
    }
    let format = "";
    if (this.data.exportFormat == "Quil") {
      format = "quil"
    } else if (this.data.exportFormat == "OpenQASM") {
      format = "qasm"
    } else if (this.data.exportFormat == "Pyquil") {
      format = "py"
    } else if (this.data.exportFormat == "Qiskit") {
      format = "py"
    } else {
      this.snackbar.open("No valid format selected.");
      return;
    }
    var blob = new Blob([this.data.circuits["export"]], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "circuit." + format);
  }
}
