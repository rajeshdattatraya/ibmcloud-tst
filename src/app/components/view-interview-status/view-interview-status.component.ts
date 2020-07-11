import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';


@Component({
  selector: 'app-view-interview-status',
  templateUrl: './view-interview-status.component.html',
  styleUrls: ['./view-interview-status.component.css']
})
export class ViewInterviewStatusComponent implements OnInit {
  config: any;
  public browserRefresh: boolean;
  userName = "";
  candidateInterviewStatus:any = [];
  resultId;
  candidateUserId;
  candidateUserName;
  index;
  isRowSelected = false;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.config = {
      currentPage: appConfig.currentPage,
      itemsPerPage: appConfig.itemsPerPage,
      totalItems:appConfig.totalItems
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
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
    console.log("Length : "+this.candidateInterviewStatus.length)
      
     /* this.Candidate.forEach(candidate => {
        candidate.candidate_users.forEach(user => {
          if (user.status == 'Active' && user.userLoggedin === 'true' ){ candidate.state='Clear\xa0Session'; } 
		      else if (user.status == 'Active' )  { candidate.state='Disable'; } 
          else {candidate.state='Enable'; }
	       });
      }); */

      
    })
  }


  onSelectionChange(resultId,candidateUserName,i){
    this.resultId=resultId;
    //this.candidateUserId=candidateUserId;
    this.candidateUserName=candidateUserName;
    this.index=i;
    this.isRowSelected = true;
  }

}
