//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { RegistrationConfigService } from '../../service/registrationConfig.service';
var daysCheck:any;

@Injectable({
  providedIn: 'root'
})

export class assignedToProjectCandidate {
  candidatesRetainDay: Object;

  constructor(private apiService : ApiService,
    private registrationConfigService: RegistrationConfigService) {
  }

  ngOnInit(){
    
  }

  // Get candidate registration retain days
  getCandidatesRegistrationRetainDays(){
    this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
      this.candidatesRetainDay = data;
      console.log("RetainFailedCanidates days =" + this.candidatesRetainDay[0].retainProjectCandidates);
    })
  }

  // Candidate assigned to account and who is in the account for more than 2 months
  isCandidateAssigned(username) {
    let candidateDetails;
    let retainCandidate : boolean = false;
    let projectAssignedDate: Date;
    let currentDate: Date = new Date();
    
  
   this.apiService.getAssignedCandidate(username).subscribe(data =>{
    candidateDetails = data;
    console.log("Assigned candidate details:" +JSON.stringify(candidateDetails));
  projectAssignedDate = new Date(candidateDetails[0].createdDate);
  projectAssignedDate.setDate(projectAssignedDate.getDate() + this.candidatesRetainDay[0].retainProjectCandidates);
  console.log("Project assigned date:" +projectAssignedDate);
  if (projectAssignedDate >= currentDate) {
    retainCandidate =  false;
  } else {
    alert("Candidate is not on bench, hence cannot be registered to other account");
    retainCandidate = true;
  }
  
  
  })
  return retainCandidate;
  }
}