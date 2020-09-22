import { Component, Input, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiService } from './../../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../app.component';
import { Dashboard } from './../../../model/dashboard';
import { appConfig } from './../../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html'

})
export class DashboardListComponent implements OnChanges {

  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  users: any[] = [];
  searchText: string;
  filters: Object;
  filteredUsers: any[] = [];
  Result: any = [];
  
  dataSource = new MatTableDataSource<any>();

  public browserRefresh: boolean;
  DashboardList: any = [];
  dashboards: any = [];
  userName: String = "";
  config: any;
  accessLevel: String = "";
  mode: string = "";
  candidateID: any;
  dashboardDetails: any = [];
  displayTechInterview: boolean = true;
  displayPartnerInterview: boolean = true;
  displayProjectAssign: boolean = true;
  quizNumber;
  userScore;
  assesmentDate;
  questionCount;
  correctAnswerCount;
  candidateAssessmentDetails:any=[];
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  filterKey : string = "";
  account: String = "";

  employeeName = "";
  onlineTestResult = "";
  userResult = "";
  technicalInterviewResult = "";
  partnerInterviewResult = "";
  assignedToProject = "";
  jobRole = "";
  canUserId = "";
  resultId = "";
  canUserName = "";
  qNumber = "";
  uScore = "";
  createdDate = "";

displayedColumns = ['Action','employeeName', 'jobRole','userResult','technicalInterviewResult','partnerInterviewResult','assignedToProject'];


  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
        this.config = {
          currentPage: appConfig.currentPage,
          itemsPerPage: appConfig.itemsPerPage,
          totalItems: appConfig.totalItems
        };
        this.browserRefresh = browserRefresh;
        if (!this.browserRefresh) {
            this.userName = this.router.getCurrentNavigation().extras.state.username;
            this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
            this.account = this.router.getCurrentNavigation().extras.state.account;
        }
  }

  ngOnChanges(): void {
      if (this.groupFilters) this.filterUserList(this.groupFilters, this.users);
      this.router.navigate(['/dashboard'])
  }

  ngOnInit() {
        this.accessLevel="partner";
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
              window.alert('You are redirected to login screen.');
              this.router.navigate(['/login-component']);
        }
        this.readResult();

        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
    }
  
    this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'employeeName': return item.employeeName;
          case 'jobRole': return item.jobRole;
          case 'onlineTestResult': return item.onlineTestResult;
          case 'technicalInterviewResult': return item.technicalInterviewResult;
          case 'partnerInterviewResult': return item.partnerInterviewResult;
          case 'assignedToProject': return item.assignedToProject;
          default: return item[property];
        }
     }

    }

    filterUserList(filters: any, users: any): void {
      this.filteredUsers = this.users; //Reset User List
      const keys = Object.keys(filters);
      const filterUser = user => {
        let result = keys.map(key => {
          if (key == "employeeName" || key == "jobRole" || key == "assignedToProject"
              || key == "technicalInterviewResult"|| key == "partnerInterviewResult") {
            if (user[key]) {
              return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
            }
          } else {
            if (key == "userResult") {
               if(user[key] == filters[key]) {
                   return true;
               }
            } else if(key == "fromDate" || key == "toDate") {
              let registeredDate = user.createdDate.split('T');
              if (registeredDate[0] >= filters.fromDate && registeredDate[0] <= filters.toDate) {
                  return true;
              }
            }
            return false;
          }
        });

        // To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
        result = result.filter(it => it !== undefined);
        return result.reduce((acc, cur: any) => { return acc & cur }, 1)
      }
      this.filteredUsers = this.users.filter(filterUser);
      this.dashboards = this.filteredUsers
	    this.dataSource.data = this.dashboards as Dashboard[];
    }

    getDashboardList(){
      this.apiService.getDashboardList().subscribe((data) => {
       this.DashboardList = data;
      })
    }
    // To Read the Results
    readResult() {
      this.apiService.getDashboardList().subscribe((data) => {
        this.Result = data;

        this.onlineTestResult = "";
        this.userResult = "";
        this.technicalInterviewResult = "";
        this.partnerInterviewResult = "";
        this.assignedToProject = "";
        this.resultId = "";
        this.qNumber = "";
        this.uScore = "";
        this.createdDate = "";

        this.Result.forEach((result) => {
            this.employeeName = "";
            this.jobRole = "";
            this.canUserId = "";
            this.canUserName = "";

           if (result.stage1_status == 'Not Started') {
             if (result.userResult == 'Fail') {
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
              this.userScore = result.userScore;
              if(result.userResult=='Pass'){
               this.userResult="Pass";
              } else if(result.userResult=='Fail'){
               this.userResult="Fail";
              } else {
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
            if (result.stage5_status == 'Not Started') {
              this.assignedToProject = "Unassigned";
            } else if (result.stage5_status == 'Skipped' || result.stage5_status == null) {
              this.assignedToProject = "N/A";
            } else if (result.stage5_status == 'Completed') {
              this.assignedToProject = "Assigned";
            }
           this.resultId = result._id;
           this.qNumber = result.quizNumber;
           this.uScore = result.userScore;
           this.createdDate = result.createdDate;
           console.log("result.result_users.length",result.result_users.length);
           if (result.result_users.length > 0) {
             this.employeeName = result.result_users[0].employeeName;
             this.jobRole = result.result_users[0].JRSS;
             this.canUserId = result.result_users[0]._id;
             this.canUserName = result.result_users[0].username;
             this.dashboards.push(new Dashboard(this.employeeName, this.jobRole, this.onlineTestResult, this.technicalInterviewResult,
                                        this.partnerInterviewResult,this.assignedToProject,this.canUserId,this.canUserName,
                                        this.resultId,this.userResult,this.qNumber,this.uScore,this.createdDate));
           }
        });
		    this.dataSource.data = this.dashboards as Dashboard[];
        this.users = this.dashboards;
        this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
      })
    }

    setCandidateID(id) {
      this.candidateID = id;
    }

    viewDetails() {
      if (this.candidateID == undefined) {
        window.alert("Please select the candidate");
      }  else {
      this.mode = "displayModalBody";
      this.displayTechInterview = true;
      this.displayPartnerInterview = true;
      this.displayProjectAssign = true;
      this.displayContractorUIFields = false;
      this.displayRegularUIFields = true;

      this.apiService.viewDashboardDetails(this.candidateID).subscribe((data) => {
         this.dashboardDetails = data;

         if (this.dashboardDetails[0].result_users[0].employeeType == 'Contractor') {
              this.displayContractorUIFields = true;
              this.displayRegularUIFields = false;
          } else {
              this.displayContractorUIFields = false;
              this.displayRegularUIFields = true;
          }

         if (this.dashboardDetails[0] === undefined ||
            (this.dashboardDetails[0].smeResult === undefined &&
             this.dashboardDetails[0].smeFeedback === undefined)) {
            this.displayTechInterview = false;
         }
         if (this.dashboardDetails[0] === undefined ||
            (this.dashboardDetails[0].managementResult === undefined &&
            this.dashboardDetails[0].managementFeedback === undefined)) {
            this.displayPartnerInterview = false;
         }
         if (this.dashboardDetails[0] === undefined ||
             this.dashboardDetails[0].result_projectAlloc.length == 0) {
             this.displayProjectAssign = false;
         }
      });
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
