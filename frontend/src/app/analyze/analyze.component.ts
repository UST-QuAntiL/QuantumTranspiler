import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';

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
  
  constructor(private http: HttpService, private data: DataService) { }

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


}
