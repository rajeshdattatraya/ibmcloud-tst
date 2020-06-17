import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-partner-interview',
  templateUrl: './partner-interview.component.html',
  styleUrls: ['./partner-interview.component.css']
})
export class PartnerInterviewComponent implements OnInit {
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

  ngOnInit() {
      this.accessLevel="partner";
      this.browserRefresh = browserRefresh;      
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
     console.log("partner details here",data)
    })
  }
}
