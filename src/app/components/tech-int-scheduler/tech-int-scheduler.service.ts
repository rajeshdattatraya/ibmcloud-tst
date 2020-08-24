import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../../model/appConfig';

@Injectable({
  providedIn: 'root'
})
export class TechIntSchedulerService {

  baseUri:string = appConfig.baseUri ;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
 
  constructor(private http: HttpClient) { }

  // Save meeting invites
  createMeetingEvents(data): Observable<any> {
        let url = `${this.baseUri}/scheduleMeeting/insertMeetingEvents`;
	
    return this.http.post(url, data, { headers: this.headers });
      
  }
        


   // Get all questions
   getMeetingEventsByCandidate(candidateEmail) {
     
    let url = `${this.baseUri}/scheduleMeeting/getMeetingEventsByCandidate/${candidateEmail}`; 

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
    
