import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../../model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class PreTechService {


 baseUri:string = appConfig.baseUri + '/api/preTechForm';
 headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(private http: HttpClient) { }

  // Get all questions
  getPreTechAssessmentQuestions(jrss) {
    let url = `${this.baseUri}/getPreTechQuestionanire/${jrss}`;
    return this.http.get(url, {headers: this.headers}).pipe(
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
