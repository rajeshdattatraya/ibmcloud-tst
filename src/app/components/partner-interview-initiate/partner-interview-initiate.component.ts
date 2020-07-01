import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { PartnerDetails } from './../../model/PartnerDetails';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';

@Component({
  selector: 'app-partner-interview-initiate',
  templateUrl: './partner-interview-initiate.component.html',
  styleUrls: ['./partner-interview-initiate.component.css']
})
export class PartnerInterviewInitiateComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  partnerInterviewDetails : any = [];
  FinalResult: any=['Recommended','Not Suitable','StandBy'];
  partnerFeedbackForm: FormGroup;
  submitted = false;
  formReset = false;
  accessLevel: String = "";
  stage4_status: String = "";
  displayTechInterviewFields = true;
  result: String = "";
  feedback: String = "";

 constructor(private cv:TechnicalInterviewListComponent,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
  private apiService: ApiService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readPartnerInterviewDetails(id);
       this.mainForm();
   }

   ngOnInit() {
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
             window.alert('You are redirected to login screen.');
             this.router.navigate(['/login-component']);
        }
   }
   

  mainForm() {
      this.partnerFeedbackForm = this.fb.group({
        finalResult: ['', [Validators.required]],
        partnerFeedback: ['', [Validators.required]]
      })
  }

  get myForm(){
        return this.partnerFeedbackForm.controls;
  }
  
  skipMethod(){
    alert('Stage skipped');
  }

   //To download candidate's CV if uploaded
   downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id) 
  }

  // Choose FinalResult with select dropdown
  updateFinalResult(e){
    this.partnerFeedbackForm.get('finalResult').setValue(e, {
    onlySelf: true
    })
  }

  //Read candidate details
  readPartnerInterviewDetails(id) {
    this.apiService.readPartnerInterviewDetails(id).subscribe(data => {
      this.partnerInterviewDetails = data;
      if(this.partnerInterviewDetails[0].stage3_status == 'Skipped') {
          this.displayTechInterviewFields = false;
      }
      if (this.partnerInterviewDetails[0].managementResult != undefined) {
          this.result = this.partnerInterviewDetails[0].managementResult
      }
      if (this.partnerInterviewDetails[0].managementFeedback != undefined) {
        this.feedback = this.partnerInterviewDetails[0].managementFeedback;
      }
      this.partnerFeedbackForm.setValue({
                  finalResult: this.result,
                  partnerFeedback: this.feedback
      });
    });
  }

   onSubmit(id) {
          this.submitted = true;
          if (!this.partnerFeedbackForm.valid) {
            return false;
          } else {
          if (this.partnerFeedbackForm.value.finalResult === 'Recommended') {
              this.stage4_status = 'Completed';
          } else {
              this.stage4_status = 'Not Started';
          }
          let partnerDetails = new PartnerDetails(this.partnerFeedbackForm.value.finalResult,
              this.partnerFeedbackForm.value.partnerFeedback,this.userName,new Date(), this.stage4_status);

          this.apiService.savePartnerFeedBack(id, partnerDetails).subscribe(
                      (res) => {
                        console.log('Partner Details successfully created!')
                        window.alert("Partner's interview detail is successfully submitted");
                        this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
                      }, (error) => {
                        console.log(error);
                      });
          }
   }

   //Reset
   resetForm(){
       this.formReset = true;
       this.partnerFeedbackForm.reset();
   }
   //Cancel
    cancelForm(){
        this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
    }

     exceptionalApproval(emailSelected, quizNumber) {
         if (window.confirm('Are you sure to provide exceptional approval?')) {
            if (this.partnerFeedbackForm.value.partnerFeedback == "") {
              alert("Please enter feedback");
            } else {
              this.stage4_status = "Skipped";
              console.log("quizNumber",quizNumber);
              console.log("emailSelected",emailSelected);
              let partnerDetails = new PartnerDetails("Exceptional Approval Given",
                            this.partnerFeedbackForm.value.partnerFeedback,this.userName,new Date(), this.stage4_status);
              this.apiService.updateExceptionalApprovalForStage4(partnerDetails,emailSelected,quizNumber).subscribe(res => {
                window.alert('Successfully provided exceptional approval');
                this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
              }, (error) => {
                console.log(error);
              })
            }
         }
      }

}
