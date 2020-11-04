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
  getPreTechAssessmentQuestions(jrss, userName) {
    let url = `${this.baseUri}/getPreTechQuestionanire/${jrss}/${userName}`; 
    console.log("The URL for pre-tech questions is" + url);
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
      return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }
  
  
// Get workflow stage status by userName
  getStageStatusByUserName( userName,userResult) {
    let url = `${this.baseUri}/getStageStatus/${userName}/${userResult}`;
	 
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
      return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }
  
  

  // Update stage 2 status status.
 updateStage2Status(userName,userResult): Observable<any> {
  let url = `${this.baseUri}/updateStage2Status/${userName}/${userResult}`;
  console.log("******* updateStage2Status url ****** ",url);
	return this.http.post(url, {headers: this.headers}).pipe(
	 catchError(this.errorMgmt)
)
}
  
   // Save as draft / submit  the pre technical assessment answers given by candidate  User by ID
   saveOrSubmitPreTechAssmentDetails(data): Observable<any> {
   console.log(" insied service class*******data*****", data);
    let url = `${this.baseUri}/saveOrSubmit`;
    return this.http.put(url, data).pipe(
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
