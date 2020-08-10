import { Component, OnInit, ViewChild } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  @ViewChild(InputComponent) child: InputComponent;
  constructor(public data: DataService) { }

  ngOnInit(): void {
  }

  async computeInternal() {
    this.child.computeInternal()
  }

}
