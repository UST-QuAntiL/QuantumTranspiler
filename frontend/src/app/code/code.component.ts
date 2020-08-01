import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  editorOptions = {theme: 'vs-light', language: 'python', automaticLayout: true};  

  constructor(public data: DataService) {   

   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
