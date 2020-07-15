import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../../model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class ResultPageService {

 userResultUri:string = appConfig.baseUri + '/result';
 headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(private http: HttpClient) { }
  
  
   // Create
  saveResult(data): Observable<any> {
    let url = `${this.userResultUri}/saveResult`;
    return this.http.post(url, data, { headers: this.headers });
  }

  // Update
  updateResult(data,id,userName): Observable<any> {
    let url = `${this.userResultUri}/updateResult/${id}/${userName}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Read
  readResult(id): Observable<any> {
    let url = `${this.userResultUri}/readResult/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
       map((res: Response) => {
         return res || {}
       }),
       catchError(this.errorMgmt)
     )
   }

   // Error handling
   errorMgmt(error: HttpErrorResponse) {
     let errorMessage = '';
     if (error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log(errorMessage);
     return throwError(errorMessage);
   }
}
