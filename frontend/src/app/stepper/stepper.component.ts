import { Component, OnInit, ViewChild } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  // providers: [{
  //   provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  // }]
})
export class StepperComponent implements OnInit {
  firstFormGroup: FormGroup;
  @ViewChild('stepper') private stepper: MatStepper;


  constructor(private _formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    
  }

  computeInternal() {
    console.log("internal")
  }

  ngAfterViewInit() {
    // this.stepper.selectedIndex = 1;
  }
}
