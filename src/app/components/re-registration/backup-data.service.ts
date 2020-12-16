import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { appConfig } from 'src/app/model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class BackupDataService {

  
 baseUri:string = appConfig.baseUri ;
 headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(private http: HttpClient) { }

 //This method will take backup of  data for the given candidate
 //and it will delete the data from the main tables
 backupCandidateData(userName): Promise<any> {
  let url = `${this.baseUri}/backupCandidateData/${userName}`;
  console.log("url:" +url);


  return this.http.post(url, {headers: this.headers}).pipe(
       catchError(this.errorMgmt)
  ).toPromise();
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
