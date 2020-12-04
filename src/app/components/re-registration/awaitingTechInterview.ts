import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { RegistrationConfigService } from './../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingTechInterview {

  candidatesRetainDay: Object;

  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService){
    this.getCandidatesRegistrationRetainDays();
  }

  // Get candidate stage's retain day from RegistrationConfig table
  getCandidatesRegistrationRetainDays(){
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
      this.candidatesRetainDay = data;
    })
  }

  // Candidate who has cleared quiz and awaiting technical SME interview should be made available or
  // registered by other account after 'y'(7 days) number of days

  isCandidateAwaitingInTechInterviewQ(username,quizNumber) {

      let userResult : string = "Pass";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;

      this.apiService.getResultByUserResultPass(username,quizNumber,userResult).subscribe((data) => {
          resultCreatedDate = new Date(data['createdDate']);
          resultCreatedDate.setDate(resultCreatedDate.getDate() + this.candidatesRetainDay[0].retainStage3Candidates);
          let currentDate: Date = new Date();
          if (resultCreatedDate >= currentDate) {
            isCandidateReleased =  false;
          } else {
            isCandidateReleased = true;
          }
      }, (error) => {
         console.log('[AwaitingTechnicalInterview]-Error found while fetching the record for tech interview awaiting candidate',error);
      });
      return isCandidateReleased;
  }
}
