import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit {
  options: string[] = ["OpenQASM", "Quil", "Qiskit", "Pyquil"]

  constructor(public data: DataService) { }

  ngOnInit(): void {
  }

  changed(event: MatSelectChange) {
    this.data.exportFormat = event.value;
  }

}
