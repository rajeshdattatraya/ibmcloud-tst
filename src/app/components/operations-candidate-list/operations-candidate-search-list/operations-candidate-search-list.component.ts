import { Component, Input, OnChanges,OnInit,ViewChild } from '@angular/core';
import { ApiService } from './../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../app.component';
import {TechnicalInterviewListComponent} from '../../technical-interview-list/technical-interview-list.component';
import { appConfig } from './../../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import { ViewResult } from './../../../model/viewResult';


@Component({
  selector: 'app-operations-candidate-search-list',
  templateUrl: './operations-candidate-search-list.component.html',
  styleUrls: ['./operations-candidate-search-list.component.css']
})
export class OperationsCandidateSearchListComponent implements OnChanges {

  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  users: any[] = [];
  filters: Object;
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
  account: String = "";
  filterObj = {};
  nameFilter: string;
  accountFilter: string;
  jrssFilter: string;
  loginAccounts:any = [];
  dataSource = new MatTableDataSource<ViewResult>();
  displayedColumnsSector = ['Action','result_users[0].employeeName','result_users[0].JRSS', 'result_users[0].account','userScore','smeResult','cvDownload'];
  displayedColumns = ['Action','result_users[0].employeeName','result_users[0].JRSS','userScore','smeResult','cvDownload'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  
  constructor(private cv:TechnicalInterviewListComponent,private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
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
        this.loginAccounts = this.account.split(",");
    }
    route.queryParams.subscribe(
    params => this.config.currentPage= params['page']?params['page']:1 );
    this.getOperationsCandidateList();
}
@ViewChild('content') content: any;
ngOnChanges(): void {
  if (this.groupFilters) this.filterUserList(this.groupFilters, this.users);
  this.router.navigate(['/operations-candidate-list'])
}

 ngOnInit() {
      this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
            window.alert('You will be redirecting to login again.');
            this.router.navigate(['/login-component']);
      }

      this.dataSource.filterPredicate = (data: any, filter) => {
        const dataStr =JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) != -1;
  }

  this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'result_users[0].employeeName': return item.result_users[0].employeeName;
        case 'result_users[0].JRSS': return item.result_users[0].JRSS;
        case 'result_users[0].account': return item.result_users[0].account;
        default: return item[property];
      }
   }
   console.log("Just before readResult()");
      this.readResult();
      console.log("Just after readResult()");
 }


 ngAfterViewInit (){
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}



pageChange(newPage: number) {
    this.router.navigate(['/operations-candidate-list'], { queryParams: { page: newPage } });
}

onSelectionChange(value) {
    this.emailSelected = value;
}

 //To download candidate's CV if uploaded
 downloadCandidateResume(id){
  this.cv.downloadCandidateResume(id) 
}

getOperationsCandidateList(){
  if(this.account.toLocaleLowerCase() =='sector'){
this.apiService.getOperationsCandidateList().subscribe((data) => {
    
      this.operationsCandidateList = data;
    })
  }
  else{
    this.apiService.getOperationsAccountCandidateList(this.account).subscribe((data) => {
      this.operationsCandidateList = data;
})
}
}


filterUserList(filters: any, users: any): void {
  this.filteredUsers = this.users; //Reset User List
  const keys = Object.keys(filters);
  const filterUser = user => {
    let result = keys.map(key => {
      if (key == "employeeName" || key == "JRSS" || key == "account") {
        if (user.result_users[0][key]) {
          return String(user.result_users[0][key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
        }
      }
      else if (user[key]) {
        return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
      } else {
        return false;
      }
    });

    // To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
    result = result.filter(it => it !== undefined);
    return result.reduce((acc, cur: any) => { return acc & cur }, 1)
  }
  this.filteredUsers = this.users.filter(filterUser);
  this.Result = this.filteredUsers;
}

// To Read the Results
readResult() {
  if(this.account.toLocaleLowerCase() !=='sector'){ 
  this.apiService.getOperationsAccountCandidateList(this.account).subscribe((data) => {
    this.Result = data;
    this.users = data
    this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
    this.dataSource.data =  data as ViewResult[];
  })
}else{
  this.apiService.getOperationsCandidateList().subscribe((data) => {
    this.Result = data;
    this.users = data
    this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
    this.dataSource.data =  data as ViewResult[];
  })
}

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
      this.router.navigate(['/initiate-operations-project/', this.emailSelected], { state: { username: this.userName, accessLevel: this.accessLevel,account:this.account } })
    }
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
