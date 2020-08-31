import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { MonacoEditorModule, NgxEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  @Input() circuitRef: string;
  editor: any;

  editorOptions = {
    theme: 'vs-light', language: 'python', automaticLayout: true, scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: 'hidden',
        horizontal: 'hidden',

        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 17,
        arrowSize: 30
    },
};;
 

  constructor(public data: DataService) { 
  }

  ngOnInit(): void {

  }

  onInit(editor) {
    this.editor = editor;
    if (this.circuitRef === "internal") {
      this.data.highlightLines.subscribe((lines: number[]) => {        
        if (lines.length > 0) {        
          let firstLine = lines[0]
          let lastLine = lines[lines.length - 1]
          this.markLine(firstLine, lastLine);
        }
      })
    }
  }

  ngAfterViewInit(): void {
  }

  onChange(circuit: string) {
    this.data.setCircuitOnWrite(this.circuitRef, circuit)
  }
  

  markLine(startLine: number, endLine: number) {
    let decorations = this.editor.model.getAllDecorations();
    decorations.forEach(decoration => {
      this.editor.deltaDecorations([decoration.id], []);
    });
    this.editor.deltaDecorations([], [
      { range: new monaco.Range(startLine,1,endLine,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
    ]);
  }
  

}
