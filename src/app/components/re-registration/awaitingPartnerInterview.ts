import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingPartnerInterview {
  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService){ }

  // Candidate awaiting partner interview should be made available or registered by other account after n number of days
  isCandidateAwaitingInPartnerInterviewQ(username,quizNumber) { 
    var resultCreatedDate: Date;
    let isCandidateReleased : boolean = false;

    // Get retainStage4Candidates column value from RegistrationConfig table
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((res) => {      
        // Get candidate awaiting partner interview result
        this.apiService.getPartnerCandidateAwaitingResult(username,quizNumber).subscribe((data) => {
            resultCreatedDate = new Date(data['createdDate']);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + res[0].retainStage4Candidates);
            let currentDate: Date = new Date();
            if (resultCreatedDate >= currentDate) {
              isCandidateReleased =  false;
            } else {
              isCandidateReleased = true;
            }
        });
        //return isCandidateReleased;
    });
    return isCandidateReleased;
  }
}
