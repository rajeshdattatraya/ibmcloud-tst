import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class FailedCandidate {

  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService) {
  }
 

  // Candidate who has failed quiz should be made available or registered by other account after 'x'(7 days) no of days

  isCandidateFailed(username,quizNumber,updatedDate, retentionDate, callback) {
      let currentDate: Date = new Date();
      let userResult : string = "Fail";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;   
      // this.apiService.getUserByUserName(username).subscribe(
      //   (res) => {
        return this.apiService.getResultByUserResultFail(username,quizNumber,userResult).then(data => {
            resultCreatedDate = new Date(data['createdDate']);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + retentionDate);
            if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false;
            } else {
              isCandidateReleased = true;
            }
            callback(isCandidateReleased);
          }, (error) => { 
            console.log("Error found while fetching records from Results collection - " + error);
            resultCreatedDate = new Date(updatedDate);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + retentionDate);
            if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false; 
            } else {
              isCandidateReleased = true;
            }  
            callback(isCandidateReleased);       
        }); 
      //, (error) => { 
      //     isCandidateReleased =  false; 
      //     console.log("Error found while fetching records from Users collection - " + error);
      // });   
    } 
  } 
