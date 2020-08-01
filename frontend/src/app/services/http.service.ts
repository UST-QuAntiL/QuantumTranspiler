import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

const url = "http://localhost:5000/"
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  async circuit_to_internal(input_circuit: {}) {
    let data = JSON.stringify(input_circuit)
    let circuit = await this.http.post(url + "circuit_to_internal", data, httpOptions).toPromise()
    console.log(circuit)
  }
}
