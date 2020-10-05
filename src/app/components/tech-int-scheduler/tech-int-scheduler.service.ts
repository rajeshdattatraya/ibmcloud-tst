import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from './../../model/appConfig';
import { SendEmail } from 'src/app/model/sendEmail';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class TechIntSchedulerService {

  baseUri:string = appConfig.baseUri ;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
 
  constructor(private http: HttpClient, private apiService: ApiService) {   }

  // Save meeting invites
  createMeetingEvents(data): Observable<any> {
        let url = `${this.baseUri}/scheduleMeeting/insertMeetingEvents`;
	
    return this.http.post(url, data, { headers: this.headers });
      
  }
        


   // Get all questions
   getMeetingEventsByCadidate(candidate) {
     
    let url = `${this.baseUri}/scheduleMeeting/getMeetingEventsByCandidate/${candidate}`; 

    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        
      return res || {}
      }),
      catchError(this.errorMgmt)
    )
    
  }

  
   // Get all questions
   updateMeetingEventsByEventID(eventID,candidateEmail, data): Observable<any> {
     
    let url = `${this.baseUri}/scheduleMeeting/updateMeetingEventsByEventID/${eventID}/${candidateEmail}`; 

    return this.http.post(url, data, {headers: this.headers}).pipe(
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
   

        sendMeetingInviteEmail(fromAddress,toAddress, emailSubject, emailMessage ) {

          console.log('fromAddress*****',fromAddress);
          console.log('toAddress*****',toAddress);
          console.log('emailSubject*****',emailSubject);
          console.log('emailMessage*****',emailMessage);


          // Send notification to the operation team                        
          let sendEmailObject = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
          this.apiService.sendEmail(sendEmailObject).subscribe(
            (res) => {
              console.log("[Technical SME Interview] - Email sent successfully to " + toAddress);            
            }, (error) => {
                console.log("[Technical SME Interview] - Error occurred while sending email to " + toAddress);
                console.log(error);
            });
                          
      }

      
  }    