import { Component, OnInit,NgZone,ViewChild } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { ExceptionApprovalDetail } from './../../model/exceptionalApprovalDetail';
import { ResultStatus } from './../../model/resultStatus';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

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


  loading = true;
  dataSource = new MatTableDataSource<ExceptionApprovalDetail>();
  displayedColumns = ['Action','employeeName', 'JRSS','onlineTestResult','technicalInterviewResult','partnerInterviewResult'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private resultPageService: ResultPageService,
              private apiService: ApiService,public fb: FormBuilder,private ngZone: NgZone) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
      }
    this.getCandidateInterviewStatus();
  }


  ngOnInit(): void {
  this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'employeeName': return item.employeeName;
          case 'JRSS': return item.JRSS;
          case 'onlineTestResult': return item.onlineTestResult;
          case 'technicalInterviewResult': return item.technicalInterviewResult;
          case 'partnerInterviewResult': return item.partnerInterviewResult;
          default: return item[property];
        }
     }
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
          }  else if (result.stage1_status == 'Completed' && result.userScore == null) {
             this.onlineTestResult = "N/A";
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
      this.dataSource.data = this.exceptionalApprovalList as ExceptionApprovalDetail[];

    })
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
        this.router.navigate(['/viewinterview-status-exception/', this.candidateUserId], { state: { username: this.userName, accessLevel: this.accessLevel,account:this.account } })
    }
  }


}
