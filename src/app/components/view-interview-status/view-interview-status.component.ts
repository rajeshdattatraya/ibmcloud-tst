import { Component, OnInit,NgZone,ViewChild } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { ExceptionApprovalDetail } from './../../model/exceptionalApprovalDetail';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-view-interview-status',
  templateUrl: './view-interview-status.component.html',
  styleUrls: ['./view-interview-status.component.css']
})
export class ViewInterviewStatusComponent implements OnInit {

  assesmentDate;
  questionCount;
  correctAnswerCount;
  mode: string = "";
  uScore;
  qNumber;
  createdDate;
  candidateAssessmentDetails:any=[];

  config: any;
  workFlowForm: FormGroup;
  public browserRefresh: boolean;
  public flag:boolean=false;
  candidateInterviewStatus:any = [];
  exceptionalApprovalList: any = [];
  accounts: any = [];
  candidateDetails: any;
  candidateUserId = "";
  candidateUserName = "";
  canAccount;
 

  userName = "";
  accessLevel = "management";
  account = "";
  employeeName = "";
  onlineTestResult = "";
  userResult = "";
  technicalInterviewResult = "";
  partnerInterviewResult = "";
  JRSS = "";
  canUserId = "";
  resultId = "";
  canUserName = "";
  stage5 = "";
  quizNumber = 1;
  userScore = "";

  filterObj = {};
  nameFilter: string;
  accountFilter: string;
  jrssFilter: string;
  loading = true;
  dataSource = new MatTableDataSource<ExceptionApprovalDetail>();
  displayedColumns = ['Action','employeeName', 'JRSS','Account','onlineTestResult','technicalInterviewResult','partnerInterviewResult'];
  displayedColumnsNoAcct = ['Action','employeeName', 'JRSS','onlineTestResult','technicalInterviewResult','partnerInterviewResult'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private resultPageService: ResultPageService,
              private apiService: ApiService,public fb: FormBuilder,private ngZone: NgZone) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accounts = this.account.split(",");
      }
    this.getCandidateInterviewStatus();
  }


  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
            let rowValue;
            if (this.filterObj['key'] == 'employeeName') {
               rowValue = data.employeeName;
            } else if (this.filterObj['key'] == 'JRSS') {
               rowValue = data.JRSS;
            } else if (this.filterObj['key'] == 'canAccount') {
               rowValue = data.canAccount;
            }
           if(rowValue && this.filterObj['key']) {
               if (rowValue.toLowerCase().startsWith(this.filterObj['value'])) {
                  return rowValue.toLowerCase().includes(this.filterObj['value']);
               }
           }
           return false;
       }
  this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'employeeName': return item.employeeName;
          case 'JRSS': return item.JRSS;
          case 'Account': return item.canAccount;
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
    this.apiService.getCandidateInterviewStatus(this.account).subscribe((data) => {
    this.candidateInterviewStatus = data;
    console.log("this.candidateInterviewStatus.length",this.candidateInterviewStatus.length);
      this.candidateInterviewStatus.forEach( candidate => {
      this.employeeName = "";
      this.onlineTestResult = "";
      this.userResult = "";
      this.technicalInterviewResult = "";
      this.partnerInterviewResult = "";
      this.JRSS = "";
      this.canAccount = "";
      this.canUserId = "";
      this.resultId = "";
      this.canUserName = "";

      this.employeeName = candidate.employeeName;
      this.JRSS = candidate.JRSS;
      this.canUserId = candidate._id;
      this.canUserName = candidate.username;
      this.canAccount = candidate.account;

      if (candidate.candidate_results.length == 0) {
        this.onlineTestResult = "Pending";
        this.userResult ="Other";
        this.technicalInterviewResult = "Pending";
        this.partnerInterviewResult = "Pending";
        this.exceptionalApprovalList.push(new ExceptionApprovalDetail(this.employeeName, this.JRSS, this.canAccount,this.onlineTestResult, this.technicalInterviewResult,
                            this.partnerInterviewResult,this.canUserId,this.canUserName,this.resultId,
                            this.userResult,this.uScore,this.qNumber,this.createdDate));
      }
      candidate.candidate_results.forEach( result => {
          this.resultId = result._id
          this.uScore = result.userScore;
          this.qNumber = result.quizNumber;
          this.createdDate = result.createdDate;
          if (result.stage1_status == 'Not Started') {
            if(result.userResult = 'Fail') {
            this.onlineTestResult = result.userScore + "%";
            this.userResult ="Fail";
            } else {
            this.onlineTestResult = "Pending";
            this.userResult ="Other";
            }
          } else if (result.stage1_status == 'Skipped') {
            this.onlineTestResult = "N/A";
            this.userResult ="Other";
          } else if (result.stage1_status == 'Completed' && result.userScore != null) {
             this.onlineTestResult = result.userScore + "%";
             if(result.userResult=='Pass'){
              this.userResult="Pass";
             }else if(result.userResult=='Fail'){
              this.userResult="Fail";             
             }else{
              this.userResult ="Other";
             }
          }  else if (result.stage1_status == 'Completed' && result.userScore == null) {
             this.onlineTestResult = "N/A";
             this.userResult ="Other";
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
           if (this.stage5 == "Not Started" || this.stage5 == "") {
                    this.exceptionalApprovalList.push(new ExceptionApprovalDetail(this.employeeName, this.JRSS, this.canAccount,this.onlineTestResult, this.technicalInterviewResult,
                    this.partnerInterviewResult,this.canUserId,this.canUserName,this.resultId,
                    this.userResult,this.uScore,this.qNumber,this.createdDate));
           }
      });
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
        this.router.navigate(['/viewinterview-status-exception/', this.candidateUserId,this.resultId], { state: { username: this.userName, accessLevel: this.accessLevel,account:this.account } })
    }
  }

  getCandidateAssessmentDetails(userid,quizId,username,userScore,createdDate) {
      this.userName=username;
      this.quizNumber=quizId;
      this.userScore=userScore;
      this.assesmentDate=createdDate;
      this.mode="displayAssessmentModalBody";
      this.apiService.getCandidateAssessmentDetails(userid,quizId).subscribe((data) => {
      this.candidateAssessmentDetails = data;
      this.questionCount=this.candidateAssessmentDetails.results.length;
      this.correctAnswerCount=Math.round((userScore*this.questionCount)/100)
     })
  }

    applyFilter(filterValue: string,key: string) {
      this.filterObj = {
            value: filterValue.trim().toLowerCase(),
            key: key
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clearFilters() {
          this.dataSource.filter = '';
          this.nameFilter = '';
          this.accountFilter = '';
          this.jrssFilter = '';
    }

}
