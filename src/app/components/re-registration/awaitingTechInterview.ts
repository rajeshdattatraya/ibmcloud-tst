import { Injectable } from '@angular/core';
import { ApiService } from './../../service/api.service';

@Injectable({
  providedIn: 'root'
})

export class AwaitingTechInterview {

  constructor(private apiService : ApiService) {
  }

  // Candidate who has cleared quiz and awaiting technical SME interview should be made available or
  // registered by other account after 'y'(7 days) number of days

  isCandidateAwaitingInTechInterviewQ(username,quizNumber) {
      //Get this value noOfDays from DB from new collection
      let noOfDays : number = 7;
      let currentDate: Date = new Date();
      let userResult : string = "Pass";
      var resultCreatedDate: Date;
      let isCandidateReleased : boolean = false;
      this.apiService.getResultByUserResultPass(username,quizNumber,userResult).subscribe(data => {
        resultCreatedDate = new Date(data['createdDate']);
        resultCreatedDate.setDate(resultCreatedDate.getDate() + noOfDays);
        if (resultCreatedDate >= currentDate) {
          isCandidateReleased =  false;
        } else {
          isCandidateReleased = true;
        }
      });
      return isCandidateReleased;
  }
}
