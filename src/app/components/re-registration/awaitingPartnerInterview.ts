import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingPartnerInterview {
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

    // Candidate awaiting partner interview should be made available or registered by other account after n number of days
    isCandidateAwaitingInPartnerInterviewQ(username,quizNumber) { 
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
    
      // Get candidates partner awaiting interview result
      this.apiService.getPartnerCandidateAwaitingResult(username,quizNumber).subscribe((data) => {
          if(data['stage3_status'] == 'Not Suitable'){
            isCandidateReleased = true;
          }else{
          resultCreatedDate = new Date(data['smeAssessmentDate']);
          resultCreatedDate.setDate(resultCreatedDate.getDate() + this.candidatesRetainDay[0].retainStage4Candidates);
          let currentDate: Date = new Date();
          if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false;
          } else {
              isCandidateReleased = true;
          }
        }
          //return isCandidateReleased;
        }, (error) => {
          console.log('[AwaitingPartnerInterview]-Error found while fetching the records for partner awaiting candidate');
          console.log(error);
          //return isCandidateReleased;
          });        
        return isCandidateReleased;
    }
}
