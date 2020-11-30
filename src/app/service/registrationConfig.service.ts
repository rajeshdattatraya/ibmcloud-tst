import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from '../model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class RegistrationConfigService {
  registerCandidateUri:string = appConfig.baseUri + '/registerCandidate';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(private http: HttpClient) { }

  // Get reatin day for stage candidate's 
  getStageCandidatsRetainDay() {
    return this.http.get(`${this.registerCandidateUri}`);
  }

  // Error handling
    // errorMgmt(error: HttpErrorResponse) {
    //   let errorMessage = '';
    //   if (error.error instanceof ErrorEvent) {
    //     // Get client-side error
    //     errorMessage = error.error.message;
    //   } else {
    //     // Get server-side error
    //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //   }
    //   console.log(errorMessage);
    //   return throwError(errorMessage);
    // }
}
