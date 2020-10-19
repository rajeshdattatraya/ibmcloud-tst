import { Component, Input, OnChanges,OnInit, ViewChild } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';

import {OperationsCandidateSearchListComponent} from '../operations-candidate-list/operations-candidate-search-list/operations-candidate-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-eligible-candidates',
  templateUrl: './eligible-candidates.component.html',
  styleUrls: ['./eligible-candidates.component.css']
})

export class EligibleCandidatesComponent implements OnInit {

 
  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>();

  
  users: any[] = [];
  filterByJRSS: Object;
  filteredUsers: any[] = [];
  Result: any = [];
  public browserRefresh: boolean;
  userName: String = "";
  config: any;
  accessLevel: String = "";
  mode: string = "";
  operationsCandidateList: any = [];
  emailSelected = "";
  quizNumber;
  candidateAssessmentDetails: any = [];
  userScore:number=0;
  assesmentDate="";
  questionCount:number=0;
  correctAnswerCount:number=0;
  candidateDetails: any = [];
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  page = 1;
  jrss='';
  itemsPerPage=appConfig.itemsPerPage;
  account='';
  positionID='';
  positionAccount;
  loginAdminAccounts:any = [];
  displayedColumns = ['Action','employeeName','userScore','smeResult','managementResult','cvDownload'];
  displayedColumnsMultiAccount = ['Action','employeeName', 'account','userScore','smeResult','managementResult','cvDownload'];

  constructor(
  private cv:TechnicalInterviewListComponent,
  private route: ActivatedRoute, 
  private router: Router, 
  private apiService: ApiService) {
    this.jrss = this.router.getCurrentNavigation().extras.state.jrss;
    this.account = this.router.getCurrentNavigation().extras.state.account;
    this.positionID = this.router.getCurrentNavigation().extras.state.positionID;
    this.positionAccount = this.router.getCurrentNavigation().extras.state.positionAccount;
    this.loginAdminAccounts = this.account.split(",");
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.getOperationsCandidateList();
}


 ngOnInit() {

      this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
            window.alert('You will be redirecting to login again.');
            this.router.navigate(['/login-component']);
      }
      this.readResult();
     
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'employeeName': return item.result_users[0].employeeName;
          case 'account': return item.result_users[0].account;
          case 'userResult': return item.userScore;
          case 'smeResult': return item.smeResult;
          case 'managementResult': return item.managementResult;
          default: return item[property];
        }
     }

 }



 //To download candidate's CV if uploaded
 downloadCandidateResume(id){
  this.cv.downloadCandidateResume(id) 
}

getOperationsCandidateList(){
  this.apiService.getOperationsCandidateList().subscribe((data) => {
   this.operationsCandidateList = data;
  })
}


// To Read the Results
readResult() {
  this.apiService.getOperationsAccountCandidateList(this.positionAccount).subscribe((data) => {
    this.Result = data;
    this.dataSource.data = this.Result.filter(singleItem => 
      singleItem.result_users[0].JRSS.toLowerCase() == this.jrss.toLowerCase() );
    this.users = data
    this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
    
  })
}


//To read candidate details
getCandidateDetails(username) {
  this.mode="displayModalBody";
  this.apiService.getCandidateDetails(username).subscribe((data) => {
       this.candidateDetails = data;
       if (this.candidateDetails[0].employeeType == 'Contractor') {
            this.displayContractorUIFields = true;
            this.displayRegularUIFields = false;
       } else {
            this.displayContractorUIFields = false;
            this.displayRegularUIFields = true;
       }
  })
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

  assignProject() {
    if (this.emailSelected == "") {
      alert("Please select the candidate")
    }
    else {
      this.router.navigate(['/initiate-operations-project/', this.emailSelected], 
      {  state: { username: this.userName, accessLevel: this.accessLevel, account: this.account, positionID: this.positionID }} 
      )
    }
  }


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  

}
