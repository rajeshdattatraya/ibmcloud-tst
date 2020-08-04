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
  selector: 'app-view-interview-status',
  templateUrl: './view-interview-status.component.html',
  styleUrls: ['./view-interview-status.component.css']
})
export class ViewInterviewStatusComponent implements OnInit {
  config: any;
  workFlowForm: FormGroup;
  public browserRefresh: boolean;
  candidateInterviewStatus:any = [];
  exceptionalApprovalList: any = [];
  candidateDetails: any;
  candidateUserId = "";
  candidateUserName = "";

  userName = "";
  accessLevel = "management";
  account = "";
  employeeName = "";
  onlineTestResult = "";
  technicalInterviewResult = "";
  partnerInterviewResult = "";
  JRSS = "";
  canUserId = "";
  resultId = "";
  canUserName = "";
  stage5 = "";
  quizNumber = 1;
  userScore = "";

  constructor(private route: ActivatedRoute, private router: Router, private resultPageService: ResultPageService,
              private apiService: ApiService,public fb: FormBuilder,private ngZone: NgZone) {
    this.config = {
      currentPage: appConfig.currentPage,
      itemsPerPage: appConfig.itemsPerPage,
      totalItems:appConfig.totalItems
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
      }
    route.queryParams.subscribe(
    params => this.config.currentPage= params['page']?params['page']:1 );
    this.getCandidateInterviewStatus();
  }


  ngOnInit(): void {
  }

  getCandidateInterviewStatus(){
    this.apiService.getCandidateInterviewStatus().subscribe((data) => {
    this.candidateInterviewStatus = data;
      this.candidateInterviewStatus.forEach( candidate => {
      this.employeeName = "";
      this.onlineTestResult = "";
      this.technicalInterviewResult = "";
      this.partnerInterviewResult = "";
      this.JRSS = "";
      this.canUserId = "";
      this.resultId = "";
      this.canUserName = "";

      this.employeeName = candidate.employeeName;
      this.JRSS = candidate.JRSS;
      this.canUserId = candidate._id;
      this.canUserName = candidate.username;
      if (candidate.candidate_results.length == 0) {
        this.onlineTestResult = "Pending";
        this.technicalInterviewResult = "Pending";
        this.partnerInterviewResult = "Pending";
      }
      candidate.candidate_results.forEach( result => {
          this.resultId = result._id
          if (result.stage1_status == 'Not Started') {
            this.onlineTestResult = "Pending";
          } else if (result.stage1_status == 'Skipped') {
            this.onlineTestResult = "N/A";
          } else if (result.stage1_status == 'Completed' && result.userScore != null) {
             this.onlineTestResult = result.userScore + "%";
          }

          if (result.stage3_status == 'Not Started') {
            this.technicalInterviewResult = "Pending";
          } else if (result.stage3_status == 'Skipped') {
            this.technicalInterviewResult = "N/A";
          } else if (result.stage3_status == 'Completed') {
            this.technicalInterviewResult = result.smeResult;
          }

          if (result.stage4_status == 'Not Started') {
            this.partnerInterviewResult = "Pending";
          } else if (result.stage4_status == 'Skipped') {
            this.partnerInterviewResult = "N/A";
          } else if (result.stage4_status == 'Completed') {
            this.partnerInterviewResult = result.managementResult;
          }
          this.stage5 = result.stage5_status;

      });
      if (this.stage5 == "Not Started" || this.stage5 == "") {
          this.exceptionalApprovalList.push(new ExceptionApprovalDetail(this.employeeName, this.JRSS, this.onlineTestResult, this.technicalInterviewResult,
                                        this.partnerInterviewResult,this.canUserId,this.canUserName,this.resultId));
      }
      });
    })
  }

  pageChange(newPage: number) {
        this.router.navigate(['/viewinterview-status'], { queryParams: { page: newPage } });
  }

  onSelectionChange(id,candidateUserName,resultId,i){
    this.candidateUserId=id;
    this.resultId=resultId;
    this.candidateUserName=candidateUserName;
  }

  exceptionalApproval() {
    if (this.candidateUserId == "") {
        alert("Please select the candidate");
    } else {
        this.router.navigate(['/viewinterview-status-exception/', this.candidateUserId], { state: { username: this.userName, accessLevel: this.accessLevel } })
    }
  }


}
