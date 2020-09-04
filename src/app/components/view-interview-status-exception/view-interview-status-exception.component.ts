import { Component, OnInit,NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { ExceptionApprovalDetail } from './../../model/exceptionalApprovalDetail';
import { ResultStatus } from './../../model/resultStatus';


@Component({
  selector: 'app-view-interview-status-exception',
  templateUrl: './view-interview-status-exception.component.html',
  styleUrls: ['./view-interview-status-exception.component.css']
})
export class ViewInterviewStatusExceptionComponent implements OnInit {

  workFlowForm: FormGroup;
  candidateDetails: any;
  candidateUserId = "";
  candidateUserName = "";

  userName = "";
  accessLevel = "management";
  stage1 = "Not Started";
  stage2 = "Not Started";
  stage3 = "Not Started";
  stage4 = "Not Started";
  stage5 = "Not Started";
  smeResult = "";
  managementResult = "";
  preTechQuestion;
  account="";
  employeeName = "";
  onlineTestResult = "";
  technicalInterviewResult = "";
  partnerInterviewResult = "";
  JRSS = "";

  resultId = "";

  quizNumber = 1;
  userScore = "";
  stage1Completed: boolean = false;
  stage2Completed: boolean = false;
  stage3Completed: boolean = false;
  stage4Completed: boolean = false;
  displayResultFields: boolean = false;


  constructor(private actRoute: ActivatedRoute, private router: Router, private resultPageService: ResultPageService,
              private apiService: ApiService,public fb: FormBuilder,private ngZone: NgZone) {
     this.userName = this.router.getCurrentNavigation().extras.state.username;
     this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
     this.account = this.router.getCurrentNavigation().extras.state.account;
     let id = this.actRoute.snapshot.paramMap.get('id');
     this.viewCandidateInterviewStatus(id);
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

  // Getter to access form control
  get myForm(){
    return this.workFlowForm.controls;
  }

  preTechQuestionCheck(event) {
    if (this.preTechQuestion <= 0) {
      event.target.checked = false
      window.alert("There are no Pre-technical Questions configured for this Job role")
      this.workFlowForm.value.stage2PreTechAssessment=false
    }
  }

  viewCandidateInterviewStatus(id) {
       this.apiService.viewCandidateInterviewStatus(id).subscribe((data) => {
           this.candidateDetails = data;
           this.candidateUserName = this.candidateDetails[0].username;
           this.apiService.getJRSSPreTech(this.candidateDetails[0].JRSS).subscribe((data) => {
                this.preTechQuestion = data[0]['jrss_preTech'].length;
           });
           if (this.candidateDetails[0].candidate_results.length > 0) {
             this.displayResultFields = true;
             this.resultId = this.candidateDetails[0].candidate_results[0]._id;
             if (this.candidateDetails[0].candidate_results[0].stage1_status == 'Completed'
                || this.candidateDetails[0].candidate_results[0].stage1_status == 'Skipped') {
               this.stage1Completed = true;
               this.stage1 = this.candidateDetails[0].candidate_results[0].stage1_status;
             }
             if (this.candidateDetails[0].candidate_results[0].stage2_status == 'Completed'
                || this.candidateDetails[0].candidate_results[0].stage2_status == 'Skipped') {
              this.stage2Completed = true;
              this.stage2 = this.candidateDetails[0].candidate_results[0].stage2_status;
             }
             if (this.candidateDetails[0].candidate_results[0].stage3_status == 'Completed'
                || this.candidateDetails[0].candidate_results[0].stage3_status == 'Skipped') {
              this.stage3Completed = true;
              this.stage3 = this.candidateDetails[0].candidate_results[0].stage3_status;
             }
             if (this.candidateDetails[0].candidate_results[0].stage4_status == 'Completed'
                || this.candidateDetails[0].candidate_results[0].stage4_status == 'Skipped') {
              this.stage4Completed = true;
              this.stage4 = this.candidateDetails[0].candidate_results[0].stage4_status;
             }
             this.stage5 = this.candidateDetails[0].candidate_results[0].stage5_status;
           }
       })
  }


  exceptionSubmit() {
     if (this.resultId == "") {
       if (this.workFlowForm.value.stage1OnlineTechAssessment) {
         this.stage1 = "Completed";
         this.userScore = "";
         this.quizNumber = 1;
       }
       if (this.workFlowForm.value.stage2PreTechAssessment) {
         this.stage2 = "Completed";
       }
       if (this.workFlowForm.value.stage3TechAssessment) {
         this.stage3 = "Completed";
         this.smeResult = "Exceptional Approval Given"
       }
       if (this.workFlowForm.value.stage4ManagementInterview) {
         this.stage4 = "Completed";
         this.managementResult = "Exceptional Approval Given";
       }
       let resultStatus = new ResultStatus(this.candidateUserName,this.quizNumber,this.userScore,this.stage1, this.stage2,
                          this.stage3, this.smeResult,this.stage4, this.managementResult, this.stage5);
       this.resultPageService.saveResult(resultStatus).subscribe(
         (res) => {
           console.log('Results table record inserted successfully');
           this.ngZone.run(() => this.router.navigateByUrl('/viewinterview-status',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
         }, (error) => {
           console.log(error);
         });
     } else {
            if (this.workFlowForm.value.stage1OnlineTechAssessment) {
             this.stage1 = "Completed";
            }
            if (this.workFlowForm.value.stage2PreTechAssessment) {
              this.stage2 = "Completed";
            }
            if (this.workFlowForm.value.stage3TechAssessment) {
              this.stage3 = "Completed";
              this.smeResult = "Exceptional Approval Given"
            }
            if (this.workFlowForm.value.stage4ManagementInterview) {
              this.stage4 = "Completed";
              this.managementResult = "Exceptional Approval Given";
            }
          this.resultPageService.readResult(this.resultId).subscribe(data => {
          if (data['stage1_status'] == 'Completed' || data['stage1_status'] == "Skipped" || this.stage1 == "") {
             this.stage1 = data['stage1_status'];
             this.userScore = data['userScore'];
             this.quizNumber = data['quizNumber'];
          }
          if (data['stage2_status'] == 'Completed' || data['stage2_status'] == "Skipped" || this.stage2 == "") {
              this.stage2 = data['stage2_status'];
          }
          if (data['stage3_status'] == 'Completed' || data['stage3_status'] == "Skipped" || this.stage3 == "") {
             this.stage3 = data['stage3_status'];
             this.smeResult = data['smeResult'];
          }
          if (data['stage4_status'] == 'Completed' || data['stage4_status'] == "Skipped" || this.stage4 == "") {
             this.stage4 = data['stage4_status'];
             this.managementResult = data['managementResult'];
          }
          this.stage5 = data['stage5_status'];

          let resultStatus = new ResultStatus(this.candidateUserName,this.quizNumber,this.userScore,this.stage1, this.stage2,
                             this.stage3, this.smeResult,this.stage4, this.managementResult,this.stage5);
          this.resultPageService.updateResult(resultStatus,this.resultId, this.candidateUserName).subscribe(
            (res) => {
              console.log('Results table updated successfully');
              this.ngZone.run(() => this.router.navigateByUrl('/viewinterview-status',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
            }, (error) => {
              console.log(error);
            });
            });
     }
  }

  //Cancel
  cancelForm() {
      this.ngZone.run(() => this.router.navigateByUrl('/viewinterview-status',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
  }

}
