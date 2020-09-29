import { Component, OnInit,NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { ExceptionApprovalDetail } from './../../model/exceptionalApprovalDetail';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component'
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
  count:any;

  resultId = "";

  quizNumber = 1;
  userScore = "";
  displayPreTechStage2Skip: boolean = false;
  displayPreTechStage2Completed: boolean = false;
  stage1Completed: boolean = false;
  stage2Completed: boolean = false;
  stage3Completed: boolean = false;
  stage4Completed: boolean = false;
  displayStage1ResultFields: boolean = false;
  displayStage2ResultFields: boolean = false;
  displayStage3ResultFields: boolean = false;
  displayStage4ResultFields: boolean = false;


  constructor(private cv:TechnicalInterviewListComponent,private actRoute: ActivatedRoute, private router: Router, private resultPageService: ResultPageService,
              private apiService: ApiService,public fb: FormBuilder,private ngZone: NgZone) {
     this.userName = this.router.getCurrentNavigation().extras.state.username;
     this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
     this.account = this.router.getCurrentNavigation().extras.state.account;
     let id = this.actRoute.snapshot.paramMap.get('id');
     let resultId = this.actRoute.snapshot.paramMap.get('resultId');
     this.viewCandidateInterviewStatus(id,resultId);
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

   //To download candidate's CV if uploaded
  downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id)
  }
  skipMethod(){
    alert('Stage skipped');
  }
  viewCandidateInterviewStatus(id,resultId) {
       this.apiService.viewCandidateInterviewStatus(id).subscribe((data) => {
           this.candidateDetails = data;
           this.candidateUserName = this.candidateDetails[0].username;
           this.apiService.getJRSSPreTechByAccountAndJrssName(this.candidateDetails[0].JRSS,this.candidateDetails[0].account).subscribe((pretechData) => {
                this.preTechQuestion = pretechData[0]['jrss_preTech'].length;
           });
           if (this.candidateDetails[0].candidate_results.length > 0) {
              let counter = 0;
              this.candidateDetails[0].candidate_results.forEach( (result) => {
                 this.resultId = result._id;
                 if (this.resultId == resultId) {
                     this.count = counter;
                     if (result.stage1_status == 'Completed' || result.stage1_status == 'Skipped') {
                       this.stage1Completed = true;
                       this.stage1 = result.stage1_status;
                       this.displayStage1ResultFields = true;
                     }
                     if (result.stage2_status == 'Completed' || result.stage2_status == 'Skipped') {
                      this.stage2Completed = true;
                      this.stage2 = result.stage2_status;
                      this.displayStage2ResultFields = true;
                     }
                     if (result.stage2_status == 'Completed') {
                       this.displayPreTechStage2Completed = true;
                     }
                     if (result.stage2_status == 'Skipped') {
                       this.displayPreTechStage2Skip = true;
                     }
                     if (result.stage3_status == 'Completed' || result.stage3_status == 'Skipped') {
                      this.stage3Completed = true;
                      this.stage3 = result.stage3_status;
                      this.displayStage3ResultFields = true;
                     }
                     if (result.stage4_status == 'Completed' || result.stage4_status == 'Skipped') {
                      this.stage4Completed = true;
                      this.stage4 = result.stage4_status;
                      this.displayStage4ResultFields = true;
                     }
                     this.stage5 = result.stage5_status;
                }
                counter++;
             });
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
