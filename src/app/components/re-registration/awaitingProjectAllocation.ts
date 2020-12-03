import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class awaitingProjectAllocation {

  constructor(private apiService : ApiService, private registrationConfigService: RegistrationConfigService) {
  }

  candidatesRetainDay:any=[];


  // Candidate  who has cleared partner interview and yet to be assigned to a project should be made available 
  //or registered by other account after 'w'(7 days) number of days
  isCandidateAwaitingInProjectAllocationQueue(username,quizNumber) {
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
      this.candidatesRetainDay = data;
      let noOfRetentionDays : number = this.candidatesRetainDay[0].retainStage4Candidates;
      let currentDate: Date = new Date();
      let isEligibleToRegister : boolean = true;
      this.apiService.getUSerResultByAttendedPartnerInterview(username,quizNumber).subscribe(data => {
        let managementAssessmentDate = new Date(data['managementAssessmentDate']);
        let managementResult : String = data['managementResult'];
        let elapsedDays = Math.floor((currentDate.getTime() - managementAssessmentDate.getTime()) / 1000 / 60 / 60 / 24);
        console.log('elapsedDays :: '+elapsedDays);
        if ((elapsedDays >= noOfRetentionDays && managementResult != 'Not Suitable') || managementResult == 'Not Suitable') {
          isEligibleToRegister =  true;
        } else {
          isEligibleToRegister = false;
        }
        return isEligibleToRegister;
      }, (error) => {
        console.log(error);
        return isEligibleToRegister;
      }); 
    })   
  }
}
