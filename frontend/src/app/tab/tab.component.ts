import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulateComponent } from '../simulate/simulate.component';
import { AnalyzeComponent } from '../analyze/analyze.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @ViewChild("simulate", {static: false}) simulateComponent: SimulateComponent;
  @ViewChild('analyze', {static: false}) analyzeComponent: AnalyzeComponent;


  constructor(private snackbar: MatSnackBar, private data: DataService) { }

  ngOnInit(): void {
  }

  tabClick(event: MatTabChangeEvent) {
    let index = event.index;
    if (index == 1) {
      this.showInformation();
      this.simulateComponent.simulate();
    } else if (index == 2) {
      this.showInformation();
      this.analyzeComponent.analyse();
    }
  }

  showInformation() {
    this.snackbar.open("Request sent to backend. Results will be available shortly.");
  } 
  

}
