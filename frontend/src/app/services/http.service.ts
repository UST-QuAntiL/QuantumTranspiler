import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from './../../environments/environment';

const url = environment.apiUrl

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

  async callBackend(data: {}, path: string) {
    let dataJSON = JSON.stringify(data)
    try {
      let circuit = await this.http.post(url + path, dataJSON, { headers, responseType: 'text' }).toPromise()
      this.snackbar.open("Successfully processed the data.");
      return circuit
    } catch (err) {
      console.log(err)
      console.log("Backend error:" +  err.error)
      this.snackbar.open("Error at handling the data: " + err.error);
    }

  }
}
