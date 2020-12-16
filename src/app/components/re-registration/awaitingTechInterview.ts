import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { RegistrationConfigService } from './../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingTechInterview {


  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService){
  }



  // Candidate who has cleared quiz and awaiting technical SME interview should be made available or
  // registered by other account after 'y'(7 days) number of days

   isCandidateAwaitingInTechInterviewQ(username,quizNumber, retentionDate, callback) {

      let userResult : string = "Pass";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;

      return (this.apiService.getResultByUserResultPass(username, quizNumber, userResult)).then((data) => {
          resultCreatedDate = new Date(data['createdDate']);
          resultCreatedDate.setDate(resultCreatedDate.getDate() + retentionDate);
          let currentDate: Date = new Date();
          
          if (resultCreatedDate >= currentDate) {
            isCandidateReleased =  false;
            callback(isCandidateReleased);
            
          } else {
            isCandidateReleased = true;
            callback(isCandidateReleased);
          }
          callback(isCandidateReleased);
      }, (error) => {
         console.log('[AwaitingTechnicalInterview]-Error found while fetching the record for tech interview awaiting candidate',error);
         callback(isCandidateReleased);
      });
  }
}
