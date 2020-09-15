import { Component,ViewChild } from '@angular/core';
import { browserRefresh } from '../../app.component';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { Observable } from 'rxjs';
import { appConfig } from './../../model/appConfig';
import { ViewResult } from './../../model/viewResult';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-view-testresults',
  templateUrl: './view-testresults.component.html',
  styleUrls: ['./view-testresults.component.css']
})
export class ViewTestresultsComponent {
  public browserRefresh: boolean;

  userName = "";
  account = "";

  userResultUri: string = appConfig.baseUri + '/result';
  users: any[] = [];
  Result: any = [];

  query = "";
  state = "Activate";
  error = "";
  quizNumber = 1;
  status = "";
  candidateDetails: any = [];
  candidateAssessmentDetails: any = [];
  mode: any;
  userScore:number=0;
  assesmentDate="";
  questionCount:number=0;
  correctAnswerCount:number=0;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;

  filterObj = {};
  nameFilter: string;
  emailFilter: string;
  jrssFilter: string;
  accountFilter: string;
  loginAdminAccounts:any = [];
  loading = true;
  dataSource = new MatTableDataSource<ViewResult>();

  displayedColumns = ['result_users[0].employeeName', 'userName','result_users[0].band','result_users[0].userPositionLocation','result_users[0].JRSS','quizNumber','userScore'];
  displayedColumnsMultiAccount = ['result_users[0].employeeName', 'userName','result_users[0].band','result_users[0].userPositionLocation','result_users[0].account','result_users[0].JRSS','quizNumber','userScore'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router,private apiService: ApiService,private http: HttpClient) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.loginAdminAccounts = this.account.split(",");
      }
  }

  ngOnInit(): void {
  this.browserRefresh = browserRefresh;
  this.dataSource.filterPredicate = (data: any, filter) => {
        const dataStr =JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) != -1;
  }

  this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'result_users[0].employeeName': return item.result_users[0].employeeName;
        case 'result_users[0].band': return item.result_users[0].band;
        case 'result_users[0].userPositionLocation': return item.result_users[0].userPositionLocation;
        case 'result_users[0].account': return item.result_users[0].account;
        case 'result_users[0].JRSS': return item.result_users[0].JRSS;
        default: return item[property];
      }
   };
  this.readResult();
  setTimeout(() => {
        this.loading = false;
  }, 2000);
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

    /**
     * getCandidateAssessmentDetails.
     * @author A.George
     * 29May2020.
     */
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

   // Get all results
   getResults(): Observable<any> {
     return this.http.get(`${this.userResultUri}/getresult/${this.account}`);

   }
   // To Read the Results of Candidate
   readResult() {
     this.getResults().subscribe((data) => {
       this.Result = data;
       this.dataSource.data = data as ViewResult[];
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
      this.emailFilter = '';
      this.jrssFilter = '';
      this.accountFilter = '';
   }
}
