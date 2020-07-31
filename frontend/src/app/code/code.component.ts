import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  editorOptions = {theme: 'vs-light', language: 'python', automaticLayout: true};  
  circuitCode: string = 'def create():\n print("he")';

  constructor() {   

   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
