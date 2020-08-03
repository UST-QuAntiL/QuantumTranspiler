import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  public inputSelected = new BehaviorSubject<Boolean>(false);
  constructor() { }
}
