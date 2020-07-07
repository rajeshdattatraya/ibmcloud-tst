import { Component, OnInit, NgZone, Output, EventEmitter, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import { appConfig } from './../../model/appConfig';

@Component({
  selector: 'app-technical-interview-list',
  templateUrl: './technical-interview-list.component.html',
  styleUrls: ['./technical-interview-list.component.css']
})

@Injectable({
  providedIn: 'root'
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
  userScore: number = 0;
  assesmentDate = "";
  questionCount: number = 0;
  correctAnswerCount: number = 0;
  resumeName1: string;
  resumeBlob: Blob;
  resumeUploaded: boolean;
  showModal: boolean = false;
  smeFeedbackForm: FormGroup;
  formReset = false;
  submitted = false;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  candidateDetails: any = [];


  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private router: Router, private apiService: ApiService, private ngZone: NgZone, private fb: FormBuilder) {
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
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      JRSS: new FormControl('')
    });
    route.queryParams.subscribe(
      params => this.config.currentPage = params['page'] ? params['page'] : 1);
    this.getTechnicalInterviewList();
    this.mainForm();
  }

  @ViewChild('content') content: any;
  ngOnInit(): void {
    
  }


  mainForm() {
    this.smeFeedbackForm = this.fb.group({
      smeFeedback: ['', [Validators.required]]
    })
  }

  get myForm() {
    return this.smeFeedbackForm.controls;
  }
  skipMethod(){
    alert('Stage skipped');
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
  
  //To download candidate's CV if uploaded
  downloadCandidateResume(id) {
    this.apiService.getCandidateJrss(id).subscribe(data => {
      //Get resume Data    
      this.resumeName1 = data['resumeName'];
      let resumeData1: String = data['resumeData'];

      var byteString = atob(resumeData1.split(',')[1]);
      // separate out the mime component
      var mimeString = resumeData1.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      this.resumeBlob = new Blob([ab], { type: mimeString });

      if (this.resumeName1 == "ResumeEmpty.doc") {
        this.resumeUploaded = false;
        alert('CV not uploaded');
      } else {
        this.resumeUploaded = true;
        saveAs(this.resumeBlob, this.resumeName1);
      }

    });
  }

  pageChange(newPage: number) {
    this.router.navigate(['/technical-interview-list'], { queryParams: { page: newPage } });
  }


  //submit
  onSubmit() {
    this.submitted = true;
    
    this.apiService.updateExceptionalApproval(this.emailSelected, this.quizNumber,  this.smeFeedbackForm.value.smeFeedback).subscribe(res => {
      window.alert('Successfully moved candidate to next stage');
      this.showModal = false;
      window.location.reload();
    }, (error) => {
      console.log(error);
    })

  }
  exceptionalApproval() {

    if (this.emailSelected == "") {
      alert("please select the candidate")
    }
    else {
      if (window.confirm("Are you sure you want to provide exemption approval?")) {
        this.showModal = true;
        this.content.open();

      }
      else {
        this.showModal = false;
      }
    }
  }
  initiateInterview() {
    if (this.emailSelected == "") {
      alert("please select the candidate")
    }
    else {
      this.router.navigate(['/technical-list/', this.emailSelected], { state: { username: this.userName, quizId: this.quizNumber, accessLevel: this.accessLevel } })
    }
  }

  onSelectionChange(value, quizNumber) {
    this.emailSelected = value;
    this.quizNumber = quizNumber;

  }

  getTechnicalInterviewList() {
    this.apiService.getTechnicalInterviewList().subscribe((data) => {
      this.TechnicalInterviewList = data;
      this.technicalInterviewCandidateList = data;
    })
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
    this.filterUserList(filters, this.technicalInterviewCandidateList);
  }


  filterUserList(filters: any, candidateList: any): void {

    this.filteredUsers = candidateList;
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

  getCandidateAssessmentDetails(userid, quizId, username, userScore, createdDate) {
    this.userName = username;
    this.quizNumber = quizId;
    this.userScore = userScore;
    this.assesmentDate = createdDate;
    this.mode = "displayAssessmentModalBody";
    this.apiService.getCandidateAssessmentDetails(userid, quizId).subscribe((data) => {
      this.candidateAssessmentDetails = data;
      this.questionCount = this.candidateAssessmentDetails.results.length;
      this.correctAnswerCount = Math.round((userScore * this.questionCount) / 100)

    })
  }
}
