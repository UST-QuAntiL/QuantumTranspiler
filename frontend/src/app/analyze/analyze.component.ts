import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-analyze',
  animations: [
    trigger('expert', [
      state('open', style({
        visibility: 'visible',
        opacity: '1',
        width: '*',
      })),
      state('closed', style({
        visibility: 'hidden',
        width: "0px",
        opacity: '0',

      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent implements OnInit {
  isExpert = false;
  formatOptions: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]
  selectedFormatOption: string;


  public depth = {
    "q_depth": 0,
    "q_gate_times": 0,
    "q_two_qubit": 0,
    "r_depth": 0,
    "r_gate_times": 0,
    "r_two_qubit": 0
  };

  architecture: string;
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
    this.architecture = "IBMQ"
    this.selectedFormatOption = "OpenQASM"
    this.unroll()
    if (!this.isExpert) {
      this.formatUsed = "qasm"
    }    
  }

  useRigetti() {
    this.architecture = "Rigetti"
    this.selectedFormatOption = "Quil"
    this.unroll()
    if (!this.isExpert) {
      this.formatUsed = "quil"
    }   
  }

  private async unroll() {  
    if (this.isExpert) {
      if (!(this.formatOptions.includes(this.selectedFormatOption))) {
        this.snackbar.open("You must choose an output language/framework or disable expert mode.");
        return
      }
    }  

    this.snackbar.open("Request sent to backend. Results will be available shortly.");
    let object = {
      "option": this.architecture,
      "circuit": this.data.circuits["internal"],
      "isExpert": this.isExpert,
      "format": this.selectedFormatOption,
    }

    let circuit = await this.http.callBackend(object, "unroll")
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
      this.snackbar.open("No valid format specified.");
      return;
    }
    var blob = new Blob([this.data.circuits["export"]], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "circuit." + this.formatUsed);
  }

  changed(event: MatSelectChange) {
    this.selectedFormatOption = event.value;
    this.formatUsed = this.selectedFormatOption;
    if (this.architecture) {
      this.unroll()
    }    
  } 

}
