import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { RegistrationConfigService } from './../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingTechInterview {

  constructor(private apiService : ApiService,private registrationConfigService : RegistrationConfigService) {
  }

  // Candidate who has cleared quiz and awaiting technical SME interview should be made available or
  // registered by other account after 'y'(7 days) number of days

  isCandidateAwaitingInTechInterviewQ(username,quizNumber) {
      let noOfDays : number;
      let userResult : string = "Pass";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
      this.registrationConfigService.getStageCandidatesRetainDay().subscribe((resp) => {
          noOfDays = resp[0].retainStage3Candidates;
          this.apiService.getResultByUserResultPass(username,quizNumber,userResult).subscribe((data) => {
              resultCreatedDate = new Date(data['createdDate']);
              resultCreatedDate.setDate(resultCreatedDate.getDate() + noOfDays);
              let currentDate: Date = new Date();
              if (resultCreatedDate >= currentDate) {
                isCandidateReleased =  false;
              } else {
                isCandidateReleased = true;
              }
          });
          return isCandidateReleased;
      });
  }
}
