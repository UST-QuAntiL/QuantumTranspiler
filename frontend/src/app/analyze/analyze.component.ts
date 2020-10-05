import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent implements OnInit {
  public depth = {
    "q_depth": 0,
    "q_gate_times": 0,
    "q_two_qubit": 0,
    "r_depth": 0,
    "r_gate_times": 0,
    "r_two_qubit": 0
  };

  formatUsed: string;
  
  constructor(private http: HttpService, private data: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async analyse() {
    let object = {
      "circuit": this.data.getCircuit("internal")
    }
    let counts: string = await this.http.callBackend(object, "depth")
    let depthObject = JSON.parse(counts)
    if (depthObject) {
      this.depth = depthObject;
    }
  }

  useQiskit() {
    this.unroll("IBMQ")
    this.formatUsed = "qasm"
  }

  useRigetti() {
    this.unroll("Rigetti")
    this.formatUsed = "quil"
  }

  private async unroll(option: string) {  
    this.snackbar.open("Request sent to backend. Results will be available shortly.");

    let object = {
      "option": option,
      "circuit": this.data.circuits["internal"],
    }

    let circuit = await this.http.callBackend(object, "unrollToNativeFormat")
    if (circuit) {
      this.data.setCircuit("export", circuit)
    }
  }

  download() {
    if (this.data.circuits[2] === "") {
      this.snackbar.open("Circuit is empty.");
      return;
    }
    if (!this.formatUsed) {
      this.snackbar.open("No valid format selected.");
      return;
    }
    var blob = new Blob([this.data.circuits["export"]], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "circuit." + this.formatUsed);
  }


}
