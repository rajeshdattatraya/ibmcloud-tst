import { Component, Input, OnChanges,OnInit } from '@angular/core';
import { ApiService } from './../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../app.component';

@Component({
  selector: 'app-partner-interview-list',
  templateUrl: './partner-interview-list.component.html',
  styleUrls: ['./partner-interview-list.component.css']
})
export class PartnerInterviewListComponent implements OnChanges {
  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  users: any[] = [];
  filters: Object;
  filteredUsers: any[] = [];
  Result: any = [];

  public browserRefresh: boolean;
  userName: String = "";
  PartnerInterviewList: any = [];
  config: any;
  accessLevel: String = "";
  mode: string = "";
  emailSelected = "";

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 5,
        totalItems:0
      };
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      }
      route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.getPartnerInterviewList();
  }

  ngOnChanges(): void {  
    if (this.groupFilters) this.filterUserList(this.groupFilters, this.users);
    this.router.navigate(['/partner-interview']);
  }
  
  ngOnInit() {
      this.accessLevel="partner";
      this.browserRefresh = browserRefresh;  
      this.readResult();    
  }

  pageChange(newPage: number) {
        this.router.navigate(['/partner-interview'], { queryParams: { page: newPage } });
  }

  exceptionalApproval() {
    if (this.emailSelected == "") {
      alert("please select the candidate")
    }

    this.apiService.updateExceptionalApprovalForStage4(this.emailSelected).subscribe(res => {
      window.alert('Succesfully updated candidate status');
      window.location.reload();
    }, (error) => {
      console.log(error);
    })
  } 

  onSelectionChange(value) {
    this.emailSelected = value;
  }

  getPartnerInterviewList(){
    this.apiService.getPartnerInterviewList().subscribe((data) => {
     this.PartnerInterviewList = data;     
    })
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
    this.apiService.getPartnerInterviewList().subscribe((data) => {
      this.Result = data;
      this.users = data
      this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;    
    })
  }

}
