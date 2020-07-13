import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';


@Component({
  selector: 'app-view-interview-status',
  templateUrl: './view-interview-status.component.html',
  styleUrls: ['./view-interview-status.component.css']
})
export class ViewInterviewStatusComponent implements OnInit {
  config: any;
  submitted = false;
  formReset = false;
  workFlowForm: FormGroup;
  public browserRefresh: boolean;
  candidateInterviewStatus:any = [];
  candidateDetails: any;
  candidateUserId = "";
  candidateUserName = "";
  index;
  isRowSelected = false;
  mode = "CandidateList";
  userName = "";
  accessLevel = "management";
  stage1: boolean = false;
  stage2: boolean = false;
  stage3: boolean = false;
  stage4: boolean = false;
  preTechQuestion;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService,public fb: FormBuilder) {
    this.config = {
      currentPage: appConfig.currentPage,
      itemsPerPage: appConfig.itemsPerPage,
      totalItems:appConfig.totalItems
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    route.queryParams.subscribe(
    params => this.config.currentPage= params['page']?params['page']:1 );
    this.getCandidateInterviewStatus();
    this.mainForm();
  }


  ngOnInit(): void {
  }

  mainForm() {
      this.workFlowForm = this.fb.group({
        stage1OnlineTechAssessment: [false],
        stage2PreTechAssessment: [false],
        stage3TechAssessment: [false],
        stage4ManagementInterview: [false]
      })
  }


  getCandidateInterviewStatus(){
    this.apiService.getCandidateInterviewStatus().subscribe((data) => {
    this.candidateInterviewStatus = data;
    console.log("Length : "+this.candidateInterviewStatus.length)
      
     /* this.Candidate.forEach(candidate => {
        candidate.candidate_users.forEach(user => {
          if (user.status == 'Active' && user.userLoggedin === 'true' ){ candidate.state='Clear\xa0Session'; } 
		      else if (user.status == 'Active' )  { candidate.state='Disable'; } 
          else {candidate.state='Enable'; }
	       });
      }); */

      
    })
  }
  preTechQuestionCheck(event) {
    if (this.preTechQuestion <= 0) {
      event.target.checked = false
      window.alert("There are no Pre-technical Questions configured for this Job role")
      this.workFlowForm.value.stage2PreTechAssessment=false
    }
  }

  onSelectionChange(resultId,candidateUserName,i){
    this.candidateUserId=resultId;
    this.candidateUserName=candidateUserName;
    this.index=i;
    this.isRowSelected = true;
  }

  exceptionalApproval() {
    if (this.candidateUserId == "") {
        alert("Please select the candidate");
    } else {
       this.mode="ExceptionalApproval";
       this.apiService.viewCandidateInterviewStatus(this.candidateUserId).subscribe((data) => {
          this.candidateDetails = data;
       })
    }
  }


  onSubmit() {
    alert("Submit");
  }

  //Cancel
  cancelForm(){
      this.mode = "CandidateList";
  }

}
