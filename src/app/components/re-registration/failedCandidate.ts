import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class failedCandidate {
  candidatesRetainDay : any;
  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService) {
  }

// Candidate who has failed quiz should be made available or registered by other account after 'x'(7 days) no of days

  isCandidateFailed(username) {
      let noOfDays : number;
      let currentDate: Date = new Date();
      let userResult : string = "Fail";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
      this.registrationConfigService.getStageCandidatesRetainDay().subscribe((resp) => {
      noOfDays = resp[0].retainFailedCandidates;    
      this.apiService.getUserByUserName(username).subscribe(
        (res) => {
          this.apiService.getResultByUserResultFail(username,res.quizNumber,userResult).subscribe(data => {
            resultCreatedDate = new Date(data['createdDate']);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + noOfDays);
            if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false;
            } else {
              isCandidateReleased = true;
            }
          }, (error) => { 
            isCandidateReleased =  false;          
            console.log("Error found while fetching records from Results collection - " + error);
        });  
        }, (error) => { 
          isCandidateReleased =  false; 
          console.log("Error found while fetching records from Users collection - " + error);
      });     
      return isCandidateReleased;
    });
  } 
}
