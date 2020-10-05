import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnalyzeComponent } from '../analyze/analyze.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @ViewChild('analyze', {static: false}) analyzeComponent: AnalyzeComponent;

  firstFormGroup: FormGroup;

  constructor(private snackbar: MatSnackBar, private _formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    
  }

  onStepChange(event: any) {
    let index = event.selectedIndex;
    if (index == 2) {
      this.showInformation()
      this.analyzeComponent.analyse();
    }
  }

  showInformation() {
    this.snackbar.open("Request sent to backend. Results will be available shortly.");
  } 
}
