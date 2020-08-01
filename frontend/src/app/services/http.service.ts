import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

const url = "http://localhost:5000/"

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//   }),
//   responseType: 'text' as 'text'
// };
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
})

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  async circuit_to_internal(input_circuit: {}) {
    let data = JSON.stringify(input_circuit)
    try {
      let circuit = await this.http.post(url + "circuit_to_internal", data, { headers, responseType: 'text' }).toPromise()
      this.snackbar.open("Successfully converted to Qiskit circuit implementation.");
      return circuit
    } catch (err) {
      console.log(err)
      this.snackbar.open("Error at handling the given circuit implementation.");
    }

  }
}
