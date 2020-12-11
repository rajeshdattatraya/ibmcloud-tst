//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';
var daysCheck:any;

@Injectable({
  providedIn: 'root'
})

export class assignedToProjectCandidate {
  candidatesRetainDay: any;
 

  constructor(private apiService : ApiService,
    private registrationConfigService: RegistrationConfigService) {
  }

  // Get candidate registration retain days
  getCandidatesRegistrationRetainDays(){
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
      this.candidatesRetainDay = data['retainProjectCandidates'];
      })
  }

  // Candidate assigned to account and who is in the account for more than 2 months
  isCandidateAssigned(userName, callback) {
    let retainCandidate : boolean = false;
    var projectAssignedDate: Date;
    
  return this.apiService.getAssignedCandidate(userName).subscribe(res =>{
   projectAssignedDate = new Date(res['createdDate']);
   projectAssignedDate.setDate(projectAssignedDate.getDate() + this.candidatesRetainDay);
  let currentDate: Date = new Date();
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