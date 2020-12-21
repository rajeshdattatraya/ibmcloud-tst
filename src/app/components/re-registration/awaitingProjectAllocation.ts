import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingProjectAllocation {

  constructor(private apiService : ApiService, private registrationConfigService: RegistrationConfigService) {
  }



  // Candidate  who has cleared partner interview and yet to be assigned to a project should be made available 
  //or registered by other account after 'w'(7 days) number of days
  isCandidateAwaitingInProjectAllocationQueue(username,quizNumber,retentionDate, callback) {
    
      let currentDate: Date = new Date();
      let isEligibleToRegister : boolean = false;
      this.apiService.getUSerResultByAttendedPartnerInterview(username,quizNumber).then(data => {
        var managementAssessmentDate;
        if ((data['stage4_status'] == 'Skipped') && (data['stage3_status'] == 'Skipped')) {
          managementAssessmentDate = new Date(data['createdDate']);              
        } else if(data['stage4_status'] == 'Skipped') {
          managementAssessmentDate = new Date(data['smeAssessmentDate']);
        }else{
          managementAssessmentDate = new Date(data['managementAssessmentDate']);
        }
        let managementResult : String = data['managementResult'];
        let elapsedDays = Math.floor((currentDate.getTime() - managementAssessmentDate.getTime()) / 1000 / 60 / 60 / 24);
        console.log('elapsedDays :: '+elapsedDays);
        if ((elapsedDays >= retentionDate && managementResult != 'Not Suitable') || managementResult == 'Not Suitable') {
          isEligibleToRegister =  true;
        } else {
          isEligibleToRegister = false;
        }
        callback(isEligibleToRegister);
      }, (error) => {
        console.log(error);
        callback(isEligibleToRegister);
      }); 
       
  }
}
