import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingPartnerInterview {

    constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService){ 
    }

   
    // Candidate awaiting partner interview should be made available or registered by other account after n number of days
    isCandidateAwaitingInPartnerInterviewQ(username,quizNumber,retentionDate, callback) { 
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
    
    // Get candidates partner awaiting interview result
     return this.apiService.getPartnerCandidateAwaitingResult(username,quizNumber).subscribe((data) => {
          if(data['stage3_status'] == 'Not Suitable'){
            isCandidateReleased = true;
          }else{
          resultCreatedDate = new Date(data['smeAssessmentDate']);
          resultCreatedDate.setDate(resultCreatedDate.getDate() + retentionDate);
          let currentDate: Date = new Date();
          if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false;
          } else {
              isCandidateReleased = true;
          }
        }
          callback(isCandidateReleased);
        }, (error) => {
          console.log('[AwaitingPartnerInterview]-Error found while fetching the records for partner awaiting candidate');
          console.log(error);
          callback(isCandidateReleased);
          });                 
    }
}
