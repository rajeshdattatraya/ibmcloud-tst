import { Injectable } from '@angular/core';
import { CommandName } from 'protractor';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class failedCandidate {
  candidatesRetainDay : any;
  constructor(private registrationConfigService: RegistrationConfigService,private apiService : ApiService) {
    this.getCandidatesRegistrationRetainDays();
  }

// Candidate who has failed quiz should be made available or registered by other account after 'x'(7 days) no of days

  // Get candidate registration retain days
  getCandidatesRegistrationRetainDays(){
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
      this.candidatesRetainDay = data;
      console.log("RetainFailedCanidates days =" + this.candidatesRetainDay[0].RetainFailedCandidates);
    })
  }
 

  isCandidateFailed(username) {
    this.getCandidatesRegistrationRetainDays();
      let currentDate: Date = new Date();
      let userResult : string = "Fail";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
      this.apiService.getUserByUserName(username).subscribe(
        (res) => {
          this.apiService.getResultByUserResultFail(username,res.quizNumber,userResult).subscribe(data => {
            resultCreatedDate = new Date(data['createdDate']);
            resultCreatedDate.setDate(resultCreatedDate.getDate() + this.candidatesRetainDay[0].RetainFailedCandidates);
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
  } 
}
