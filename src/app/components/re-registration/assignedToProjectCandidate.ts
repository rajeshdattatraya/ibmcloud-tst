//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';
var daysCheck:any;

@Injectable({
  providedIn: 'root'
})

export class AssignedToProjectCandidate {

  constructor(private apiService : ApiService,
    private registrationConfigService: RegistrationConfigService) {
  }

 
  // Candidate assigned to account and who is in the account for more than 2 months
  isCandidateAssigned(userName, retentionDate, callback) {
    let candidateDetails: Object;
    let retainCandidate : boolean = false;
    var projectAssignedDate: Date;
    let currentDate: Date = new Date();
  return this.apiService.getAssignedCandidate(userName).then(data =>{
    candidateDetails = data;
    console.log("Assigned candidate details:" +JSON.stringify(candidateDetails));
  projectAssignedDate = new Date(candidateDetails[0].createdDate);
  projectAssignedDate.setDate(projectAssignedDate.getDate() + retentionDate);
  if (projectAssignedDate >= currentDate) {
    retainCandidate =  false;
  } else {
    alert("Candidate is not on bench, hence cannot be registered to other account");
    retainCandidate = true;
  }
  callback(retainCandidate);
  
  },(error) => {
    console.log('[ProjectAllocation]-Error found while fetching the record for candidate allocated to project',error);
    callback(retainCandidate);
 })
  
  }
}