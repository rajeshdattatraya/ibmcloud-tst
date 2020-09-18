import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { OpenPositionService } from './../../service/openposition.service';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { PartnerDetails } from './../../model/PartnerDetails';
import { CandidateGPDetails } from './../../model/candidateGPDetails';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';
import { SendEmail } from './../../model/sendEmail';

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
  myOpenPositionGroup: FormGroup;
  submitted = false;
  formReset = false;
  accessLevel: String = "";
  stage4_status: String = "";
  displayTechInterviewFields = true;
  result: String = "";
  feedback: String = "";
  error = '';
  usersDetail:any = [];
  usersArray:any = [];
  account: String = "";

  OpenPositions: any = [];
  lineOfBusiness:any ;
  positionID :any;
  competencyLevel:any;
  positionLocation:any;
  UserPositionLocation:any = [];
  rateCardJobRole:any ;
  OpenPosition: any= [];
  UserLOB: any = [];
  Band:any = [];
  band: any;
  userLOB: any;
  candidateID: any;

  fromAddress: String = "";
  emailSubject: String = "";
  emailMessage: String = "";
  toAddress: String = "";
  displayPositionDetails = false;
  grossProfit;

 constructor(private cv:TechnicalInterviewListComponent,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
  private apiService: ApiService, private openPositionService: OpenPositionService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
       this.account = this.router.getCurrentNavigation().extras.state.account;
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readPartnerInterviewDetails(id);
       this.mainForm();
       this.mainOpenForm();
       this.readUserPositionLocation();
       this.readUserLineOfBusiness();
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
      this.candidateID = this.partnerInterviewDetails[0].result_users[0]._id;
      this.grossProfit = this.partnerInterviewDetails[0].result_users[0].grossProfit;
      this.openPositionService.readOpenPositionByPositionName(this.partnerInterviewDetails[0].result_users[0].openPositionName).subscribe((openPositionData) => {
          this.lineOfBusiness = openPositionData['lineOfBusiness'];
          this.positionID = openPositionData['positionID'];
          this.competencyLevel = openPositionData['competencyLevel'];
          this.positionLocation = openPositionData['positionLocation'];
          this.rateCardJobRole =  openPositionData['rateCardJobRole'];
          this.myOpenPositionGroup.setValue({
                positionName: openPositionData['positionName'],
                rateCardJobRole: openPositionData['rateCardJobRole'],
                lineOfBusiness: openPositionData['lineOfBusiness'],
                positionID: openPositionData['positionID'],
                positionLocation: openPositionData['positionLocation'],
                competencyLevel : openPositionData['competencyLevel'],
                userPositionLocation: this.partnerInterviewDetails[0].result_users[0].userPositionLocation,
                grossProfit: this.partnerInterviewDetails[0].result_users[0].grossProfit

          });
          this.displayPositionDetails = true;
      }) ;
    });
  }

  // Set email notification parameters
  setEmailNotificationDetails(){
    this.apiService.getUserByAccessLevel("management").subscribe( (res) => {
      this.usersDetail = res;
      this.usersArray = [];
        for (var value of this.usersDetail){
          this.usersArray.push(value.username);
        }
        this.toAddress = this.usersArray;
        }, (error) => {
            this.error = '[Partner toAddress]Error found while getting username from Users table'
            console.log(error);
    });

    this.fromAddress = this.userName;
    this.emailSubject = "Candidate Assignment Notification";
    this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate "
      + this.partnerInterviewDetails[0].result_users[0].employeeName
      + " is added to the queue for job role " + this.partnerInterviewDetails[0].result_users[0].JRSS
      + ".</p><p>Please validate the candidate for new project assignment.</p>\
      <p>Regards, <br>DWP Partner Team</p>";
  }

  onSubmit(id) {
          this.submitted = true;
          this.setEmailNotificationDetails();

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

                  // Send notification to the operation team
                  let sendEmailObject = new SendEmail(this.fromAddress, this.toAddress, this.emailSubject, this.emailMessage);
                  this.apiService.sendEmail(sendEmailObject).subscribe(
                    (res) => {
                      console.log("[Partner Initiate Interview] - Email sent successfully to " + this.toAddress);
                    }, (error) => {
                        console.log("[Partner Initiate Interview] - Error occurred while sending email to " + this.toAddress);
                        console.log(error);
                   });

                   //Save open position name , candidate location and grossProfit in candidate collection
                   let candidateDetails = new CandidateGPDetails(this.myOpenPositionGroup.value.grossProfit,
                   this.myOpenPositionGroup.value.userPositionLocation,this.myOpenPositionGroup.value.positionName);
                   console.log("candidateID",this.candidateID);
                    this.apiService.updateCandidate(this.candidateID, candidateDetails).subscribe((data)=> {
                      console.log('Candidate Details successfully updated!')
                    });

                  // Navigate to partner-list page
                  this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
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
        this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
    }

    exceptionalApproval(emailSelected, quizNumber) {
        this.setEmailNotificationDetails();
         if (window.confirm('Are you sure to provide exceptional approval?')) {
            if (this.partnerFeedbackForm.value.partnerFeedback == "") {
              alert("Please enter feedback");
            } else {
              this.stage4_status = "Completed";
              let partnerDetails = new PartnerDetails("Exceptional Approval Given",
                            this.partnerFeedbackForm.value.partnerFeedback,this.userName,new Date(), this.stage4_status);
              this.apiService.updateExceptionalApprovalForStage4(partnerDetails,emailSelected,quizNumber).subscribe(res => {
              window.alert('Successfully provided exceptional approval');

              // Send notification to the operation team
              let sendEmailObject = new SendEmail(this.fromAddress, this.toAddress, this.emailSubject, this.emailMessage);
              this.apiService.sendEmail(sendEmailObject).subscribe(
                (res) => {
                    console.log("[Partner Interview Exceptional Approval] - Email sent successfully to " + this.toAddress);
                 }, (error) => {
                    console.log("[Partner Interview Exceptional Approval] - Error occurred while sending email to " + this.toAddress);
                    console.log(error);
              });

              // Navigate to partner-list page
              this.ngZone.run(() => this.router.navigateByUrl('/partner-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
              }, (error) => {
                console.log(error);
              })
            }
         }
      }

      /* Start GP */
      // Getter to access form control
      get myOpenForm(){
        return this.myOpenPositionGroup.controls;
      }

      updateOpenPositionProfile(positionName) {
               this.openPositionService.readOpenPositionByPositionName(positionName).subscribe((data) => {
                    this.lineOfBusiness = data['lineOfBusiness'];
                    this.positionID = data['positionID'];
                    this.competencyLevel = data['competencyLevel'];
                    this.positionLocation = data['positionLocation'];
                    this.rateCardJobRole = data['rateCardJobRole'];
                  this.myOpenPositionGroup.setValue({
                        positionName: data['positionName'],
                        rateCardJobRole: data['rateCardJobRole'],
                        lineOfBusiness: data['lineOfBusiness'],
                        positionID: data['positionID'],
                        positionLocation: data['positionLocation'],
                        competencyLevel : data['competencyLevel'],
                        userPositionLocation: '',
                        grossProfit: ''
                  });
               })
               this.displayPositionDetails = true;
      }

      // Choose user position location with select dropdown
     updateUserPositionLocationProfile(e){
       this.myOpenPositionGroup.get('userPositionLocation').setValue(e, {
       onlySelf: true
       })
     }
     calculateGP() {
         if (this.myOpenPositionGroup.value.userPositionLocation == null || this.myOpenPositionGroup.value.positionName == null
             || this.myOpenPositionGroup.value.userPositionLocation == '' || this.myOpenPositionGroup.value.positionName == '') {
            window.alert("Please select Open Position/User Position Location");
            return false;
         }
         if (this.userLOB == null || this.band == null || this.userLOB == '' || this.band == '') {
            window.alert("Please select User Line Of Business/Band");
            return false;
         }
         let GP: number = 0;
         let rateCardValue: number = 0;
         let costCardValue: number = 0;
         let costCardCode = ""
         let rateCardCode = ""
         rateCardCode = this.myOpenPositionGroup.value.lineOfBusiness+" - "+this.myOpenPositionGroup.value.positionLocation+" - "+
                        this.myOpenPositionGroup.value.rateCardJobRole+" - "+this.myOpenPositionGroup.value.competencyLevel;
         this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
           rateCardValue = data['rateCardValue'];
            if (this.band == 'Exec' || this.band == 'Apprentice' || this.band == 'Graduate') {
             costCardCode = this.myOpenPositionGroup.value.userPositionLocation+" - "+this.userLOB+" - "+this.band
            } else {
             costCardCode = this.myOpenPositionGroup.value.userPositionLocation+" - "+this.userLOB+" - Band-"+this.band
            }
           this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
              costCardValue = data['costCardValue'];
              if (costCardValue == null || rateCardValue == null) {
                 window.alert("Candidate location and line of business are not compatible, please check the data and calculate GP again.");
                 return false;
              } else {
                 GP = Math.round(((rateCardValue-costCardValue)/costCardValue)*100)
              }
              this.myOpenPositionGroup.get('grossProfit').setValue(GP);
              this.grossProfit = GP;
           })
        })
     }

     //get all open positions
     getOpenPositionDetails() {
         let status = "Open";
         if (this.partnerInterviewDetails[0].result_users[0].JRSS == '') {
           window.alert("Please select candidate Job Role");
           return false;
         } else {
             this.openPositionService.listAllOpenPositionsBYJRSS(this.account, status,this.partnerInterviewDetails[0].result_users[0].JRSS).subscribe((data) => {
                this.OpenPositions = data;
             })
         }
         this.myOpenPositionGroup.get('grossProfit').setValue(this.partnerInterviewDetails[0].result_users[0].grossProfit);
         this.myOpenPositionGroup.get('userPositionLocation').setValue(this.partnerInterviewDetails[0].result_users[0].userPositionLocation);
         this.band = this.partnerInterviewDetails[0].result_users[0].band;
         this.userLOB = this.partnerInterviewDetails[0].result_users[0].userLOB;
     }


     // Get all User Line of business
     readUserLineOfBusiness(){
         this.openPositionService.getLineOfBusiness().subscribe((data) => {
         this.UserLOB = data;
        })
     }

    // Get all PositionLocation
    readUserPositionLocation(){
       this.openPositionService.getPositionLocations().subscribe((data) => {
          this.UserPositionLocation = data;
       })
    }

     mainOpenForm() {
         this.myOpenPositionGroup = new FormGroup({
           positionName: new FormControl(),
           rateCardJobRole: new FormControl(),
           lineOfBusiness: new FormControl(),
           positionID: new FormControl(),
           positionLocation: new FormControl(),
           competencyLevel:new FormControl(),
           userPositionLocation:new FormControl(),
           grossProfit:new FormControl()
         })
       }
      /*End GP*/

}
