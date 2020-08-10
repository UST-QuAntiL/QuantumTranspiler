import { Component, OnInit } from '@angular/core';
import { gateMap } from '../services/Operation';
import { ViewEncapsulation } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-unroll',
  templateUrl: './unroll.component.html',
  styleUrls: ['./unroll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnrollComponent implements OnInit {
  selectedGates = [];
  gateMap = gateMap;
  chooseRigetti = false;
  chooseIBMQ = false;
  chooseNative = false;
  
  constructor(private http: HttpService, private data: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  deselect() {
    this.chooseIBMQ = false;
    this.chooseRigetti = false;
    this.chooseNative = false; 

  }

  async unroll() {
    if (!(this.chooseIBMQ || this.chooseNative || this.chooseRigetti)) {
      this.snackbar.open("You must choose to which gates the circuit should be unrolled to.");
      return
    }

    // let object = {
    //   "option": this.selectedOption,
    //   "circuit": this.circuit
    // }
    // if (this.convert) {
    //   if (this.data.exportFormat === "") {
    //     this.snackbar.open("You must choose an output language/framework.");
    //   return

    //   }
    //   object["optionOutput"] = this.data.exportFormat;
    // }
    // let circuit = await this.http.computeCircuit(object, this.compute)
    // if (circuit) {
    //   if (this.convert) {
    //     this.data.exportCircuit = circuit
    //   } else {
    //     this.data.circuits[0] = circuit
    //   }      
    // }    
  }

}
