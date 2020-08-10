import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { HttpService } from '../services/http.service';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {editorOptions} from '../services/Options';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit {
  @Input() compute: string;
  convert: boolean = false;
  
  editorOptions = editorOptions;
  constructor(private http: HttpService, private data: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.compute === "convert") {
      this.convert = true;
    } else {
      this.convert = false;
    }
  }

  inputFile() {
    document.getElementById('fileInput').addEventListener('change', this.readFile.bind(this), false);
    document.getElementById('fileInput').click()
  }

  readFile(event: any) {
    let file = event.target.files[0]; // FileList object
    console.log(file)

    let extension = file.name.split('.').pop()
    console.log(extension)

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // when the reader is done, the content is in reader.result.
      this.data.setCircuit("import", reader.result);
    }.bind(this);

    reader.readAsText(file);
  }

  async computeInternal() {
    if (!(this.data.options.includes(this.data.inputFormat))) {
      this.snackbar.open("You must choose an input language/framework.");
      return
    }

    let object = {
      "option": this.data.inputFormat,
      "circuit": this.data.circuits["import"]
    }
    if (this.convert) {
      if (this.data.exportFormat === "") {
        this.snackbar.open("You must choose an output language/framework.");
      return

      }
      object["optionOutput"] = this.data.exportFormat;
    }
    let circuit = await this.http.computeCircuit(object, this.compute)
    if (circuit) {
      let index: string;
      if (this.convert) {
        index = "export";
      } else {
        index = "internal";
      }
      this.data.setCircuit(index, circuit)      
    }    
  }
}
