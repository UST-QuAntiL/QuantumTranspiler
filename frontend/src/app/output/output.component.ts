import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  editorOptions = {theme: 'vs-light', language: 'python', automaticLayout: true};  
  
  constructor(public data: DataService) { }

  ngOnInit(): void {
  }

}
