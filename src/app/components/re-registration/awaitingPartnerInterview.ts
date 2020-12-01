import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingPartnerInterview {
  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService){ }

  //Candidate awaiting partner interview should be made available or registered 
  //by other account after 'z'(7 days) number of days
  isCandidateAwaitingInPartnerInterviewQ(username,quizNumber) {      
    let candidateRetainDays : number;
    var resultCreatedDate: Date;
    let isCandidateReleased : boolean = false;

    // Get stage4 candidate's retain days
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((res) => {
      candidateRetainDays = res[0].retainStage4Candidates; 
        this.apiService.getPartnerCandidateAwaitingResult(username,quizNumber).subscribe((data) => {
            resultCreatedDate = new Date(data['createdDate']);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + candidateRetainDays);
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
