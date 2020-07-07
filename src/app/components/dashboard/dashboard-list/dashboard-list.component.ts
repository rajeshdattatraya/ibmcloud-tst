import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ApiService } from './../../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../app.component';
import { Dashboard } from './../../../model/dashboard';
import { appConfig } from './../../../model/appConfig';


@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html'

})
export class DashboardListComponent implements OnChanges {

  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  users: any[] = [];
  searchText: string;
  filters: Object;
  filteredUsers: any[] = [];
  Result: any = [];

  public browserRefresh: boolean;
  DashboardList: any = [];
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
        }
        route.queryParams.subscribe(
        params => this.config.currentPage= params['page']?params['page']:1 );
        this.getDashboardList();
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
    }

    filterUserList(filters: any, users: any): void {
      this.filteredUsers = this.users; //Reset User List
      const keys = Object.keys(filters);
      const filterUser = user => {
        let result = keys.map(key => {
          if (key == "employeeName" || key == "JRSS") {
            if (user.result_users[0][key]) {
              return String(user.result_users[0][key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
            }
          } else if (user[key]) {
                return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase());
          } else {
            if (key == "fromDate" || key == "toDate") {
              let createdKey = "createdDate";
              let registeredDate = user.result_users[0][createdKey].split('T');
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
      this.Result = this.filteredUsers
    }


    pageChange(newPage: number) {
          this.router.navigate(['/dashboard'], { queryParams: { page: newPage } });
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
        this.users = data
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


  }
