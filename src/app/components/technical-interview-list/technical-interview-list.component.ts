import { Component, OnInit, NgZone,Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormBuilder, Validators,FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';


@Component({
  selector: 'app-technical-interview-list',
  templateUrl: './technical-interview-list.component.html',
  styleUrls: ['./technical-interview-list.component.css']
})
export class TechnicalInterviewListComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  accessLevel: String = "";
  TechnicalInterviewList: any = [];
  config: any;
  emailSelected = "";
  quizNumber;
  technicalInterviewCandidateList: any = [];
  filteredUsers: any[] = [];
  form: FormGroup;
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  candidateAssessmentDetails: any = [];
  mode: any;
  userScore:number=0;
  assesmentDate="";
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private ngZone: NgZone,private fb: FormBuilder) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 0
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      JRSS: new FormControl('')
      });
    route.queryParams.subscribe(
      params => this.config.currentPage = params['page'] ? params['page'] : 1);
    this.getTechnicalInterviewList();
  }

  ngOnInit(): void {
  }

  pageChange(newPage: number) {
    this.router.navigate(['/technical-interview-list'], { queryParams: { page: newPage } });
  }

  exceptionalApproval() {
    if (this.emailSelected == "") {
      alert("please select the candidate")
    }
    else {
      this.apiService.updateExceptionalApproval(this.emailSelected,this.quizNumber).subscribe(res => {
        window.alert('Succesfully updated candidate');
        window.location.reload();
      }, (error) => {
        console.log(error);
      })
    }
  }
  initiateInterview() {
    if (this.emailSelected == "") {
      alert("please select the candidate")
    }
    else {
      this.router.navigate(['/technical-list/', this.emailSelected], { state: { username: this.userName, accessLevel: this.accessLevel } })
    }
  }

  onSelectionChange(value,quizNumber) {
    this.emailSelected = value;
    this.quizNumber=quizNumber;

  }

  getTechnicalInterviewList() {
    this.apiService.getTechnicalInterviewList().subscribe((data) => {
      this.TechnicalInterviewList = data;
      this.technicalInterviewCandidateList=data;
    })
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
    this.filterUserList(filters,this.technicalInterviewCandidateList);
    }


    filterUserList(filters: any, candidateList: any): void {

      this.filteredUsers = candidateList; //Reset User List
      const keys = Object.keys(filters);

      const filterUser = user => {
        let result = keys.map(key => {
          if (key == "employeeName" || key == "JRSS") {
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
      this.filteredUsers = candidateList.filter(filterUser);
      this.TechnicalInterviewList = this.filteredUsers

    }

    getCandidateAssessmentDetails(userid,quizId,username,userScore,createdDate) {
      this.userName=username;
      this.quizNumber=quizId;
      this.userScore=userScore;
      this.assesmentDate=createdDate;
      this.mode="displayAssessmentModalBody";
      this.apiService.getCandidateAssessmentDetails(userid,quizId).subscribe((data) => {
      this.candidateAssessmentDetails = data;
     })
  }
}
