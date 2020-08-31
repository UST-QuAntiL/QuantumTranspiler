import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {
  qubits = [null, null];
  clbits = [];
  params = [];
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.qubits = data.qubits;
    this.params = data.params;
    this.clbits = data.clbits;
  }
  ngOnInit(): void {
  }


  isNumber(number) {
    if (number === "") {
      return false;
    }
    return !isNaN(number)
  }

  valuesSelected(event: MouseEvent) {
    let data = {
      qubits: this.qubits,
      params: this.params,
      clbits: this.clbits
    }
    this._bottomSheetRef.dismiss(data);
    event.preventDefault();

  }

  trackByFn(item, id){
    return item
  }

}
