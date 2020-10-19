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
  submitted = false;
  formReset = false;
  accessLevel: String = "";
  stage4_status: String = "";
  displayTechInterviewFields = true;
  result: String = "";
  feedback: String = "";
  error = '';
  candidateList:any = [];
  usersArray:any = [];
  account: String = "";
  onLoad = false;

  openPositionsList:any = [];
  positionID :any;
  positionLocation:any;
  positionName:any;
  rateCardJobRole:any ;

  UserPositionLocation:any = [];
  OpenPosition: any= [];
  UserLOB: any = [];
  Band:any = [];
  band: any;
  userLOB: any;
  grossProfit: any;
  oldCandidateLocation: any;
  candidateLocation: any;
  candidateID: any;
  candidateJRSS:any;
  candidateAccount:any;

  fromAddress: String = "";
  emailSubject: String = "";
  emailMessage: String = "";
  toAddress: String = "";

  positionDetails:any = [];
  rateCardLOB='';
  rateCardLocation='';
  rateCardComplexityLevel='';
  rateCardRole='';
  displayPositionDetails=false;
  displayPositionDropDown=false;


 constructor(private cv:TechnicalInterviewListComponent,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
  private apiService: ApiService, private openPositionService: OpenPositionService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
       this.account = this.router.getCurrentNavigation().extras.state.account;
       this.positionID = this.router.getCurrentNavigation().extras.state.positionID;
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readPartnerInterviewDetails(id);
       this.mainForm();
       this.readUserPositionLocation();
   }

   ngOnInit() {
        this.browserRefresh = browserRefresh;
        this.onLoad = true;
        if (this.browserRefresh) {
             window.alert('You are redirected to login screen.');
             this.router.navigate(['/login-component']);
        }
        if (this.positionID != null ||  this.positionID != undefined) {
          this.readOpenPositionsByPositionID();
        } else {
          //if position is not already selected then display the positions in dropdown
          this.displayPositionDropDown=true;
        }
        this.readPositionLocation();
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
      this.candidateLocation = this.partnerInterviewDetails[0].result_users[0].userPositionLocation;
      this.userLOB = this.partnerInterviewDetails[0].result_users[0].userLOB;
      this.band = this.partnerInterviewDetails[0].result_users[0].band;
      this.candidateJRSS = this.partnerInterviewDetails[0].result_users[0].JRSS;
      this.candidateAccount = this.partnerInterviewDetails[0].result_users[0].account;
      this.positionName = this.partnerInterviewDetails[0].result_users[0].openPositionName;
      this.positionID = this.partnerInterviewDetails[0].result_users[0].positionID;
      this.oldCandidateLocation = this.candidateLocation;
      this.getSelectedPositionDetails(this.positionID);
      this.listAllOpenPositions();
      });
  }

       // Set email notification parameter details
       setEmailNotificationDetails(){       
        // Get account for candidate from candidate table     
        this.apiService.getCandidateJrss(this.partnerInterviewDetails[0].result_users[0].username).subscribe( (res) => {
          this.candidateList = res;      
         
          // Get operation team email id based on accessLevel and account 
          this.apiService.getUserByAccessLevel("management",this.candidateList.account).subscribe( (res) => {
            this.usersArray = [];          
            for (var user of res){
              this.usersArray.push(user.username);           
            }
  
            this.toAddress = this.usersArray;
            this.fromAddress = "talent.sourcing@in.ibm.com";
            this.emailSubject = "Candidate Assignment Notification in Talent Sourcing Tool";
            this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate "
                + this.partnerInterviewDetails[0].result_users[0].employeeName
                + " is added to the queue for job role " 
                + this.partnerInterviewDetails[0].result_users[0].JRSS
                + ".</p><p>Please validate the candidate for new project assignment.</p>\
                <p>Regards, <br>" + this.account + " Partner Team</p>";
            }, (error) => {
              this.error = '[Get Ops Email ID] - Error found while getting username from Users table'
              console.log(error);
            });
  
        }, (error) => {
        this.error = '[Get candidate account] - Error found while getting details from Candidate table'
        console.log(error);
      });
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

                  // Send email only if stage4 status is completed
                  if ( this.stage4_status === 'Completed')
                  {
                    // Send notification to the operation team
                    let sendEmailObject = new SendEmail(this.fromAddress, this.toAddress, this.emailSubject, this.emailMessage);
                    this.apiService.sendEmail(sendEmailObject).subscribe(
                      (res) => {
                        console.log("[Partner Initiate Interview] - Email sent successfully to " + this.toAddress);
                      }, (error) => {
                          console.log("[Partner Initiate Interview] - Error occurred while sending email to " + this.toAddress);
                          console.log(error);
                    });
                  }

                   //Save open position name , candidate location and grossProfit in candidate collection
                   let candidateDetails = new CandidateGPDetails(this.grossProfit,this.candidateLocation,this.positionName,this.positionID);
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

      // Choose user position location with select dropdown
     updateUserPositionLocationProfile(userSelectedCandidateLocation){
       this.displayPositionDetails = true;
       if (userSelectedCandidateLocation != null ||  userSelectedCandidateLocation != undefined) {
        this.candidateLocation = userSelectedCandidateLocation;
        this.calculateGP();
       }
     }
     calculateGP() {
         if ((this.candidateLocation == null || this.candidateLocation == '' || this.positionName == null || this.positionName == '')
          && this.onLoad==false){
            window.alert("Please select Open Position/Candidate Position Location");
            return false;
         }
         let GP: number = 0;
         let rateCardValue: number = 0;
         let costCardValue: number = 0;
         let costCardCode = ""
         let rateCardCode = ""
         rateCardCode = this.rateCardLOB + " - " + this.rateCardLocation + " - " + this.rateCardRole + " - " + this.rateCardComplexityLevel;

         if (this.band == 'Exec' || this.band == 'Apprentice' || this.band == 'Graduate') {
          costCardCode = this.candidateLocation+" - "+this.userLOB+" - "+this.band
         } else {
          costCardCode = this.candidateLocation+" - "+this.userLOB+" - Band-"+this.band
         }
         this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
           rateCardValue = data['rateCardValue'];

           this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
              costCardValue = data['costCardValue'];

              if ((rateCardValue == null || rateCardValue == undefined) && this.onLoad==false) {
                 window.alert("No rate card value available for this rate code: ''"+rateCardCode+"' , choose a different position.");
                 this.candidateLocation = this.oldCandidateLocation;
                 this.grossProfit = '';
                 return false;
              } if ((costCardValue == null || costCardValue == undefined) && this.onLoad==false) {
                 window.alert("No cost card value available for this cost code: ''"+costCardCode+"' , choose a different candidate location.");
                 this.candidateLocation = this.oldCandidateLocation;
                 this.grossProfit = '';
                 return false;
              } else {
                 this.oldCandidateLocation = this.candidateLocation;
                 this.grossProfit = Math.round(((rateCardValue-costCardValue)/costCardValue)*100);
                 if (isNaN(this.grossProfit)) {
                   this.grossProfit = '';
                 }
              }
              this.onLoad = false;
           })
        })
     }

    // Get all PositionLocation
    readUserPositionLocation(){
       this.openPositionService.getPositionLocations().subscribe((data) => {
          this.UserPositionLocation = data;
       })
    }

      /*End GP*/


    getSelectedPositionDetails(positionID) {
      this.displayPositionDetails = true;
      this.positionID = positionID
      if (this.positionID != null ||  this.positionID != undefined) {
        this.readOpenPositionsByPositionID();

      }
    }


     // To Read the Open Position
     readOpenPositionsByPositionID() {
      this.openPositionService.readOpenPositionByPositionID(this.positionID).subscribe((data) => {
        this.positionDetails = data;
        console.log('this.positionDetails inside pos by ID ***** ',data);
        this.positionID = data['positionID']
        this.positionName = data['positionName']
        this.rateCardLOB = data['lineOfBusiness']
        this.rateCardLocation = data['positionLocation']
        this.rateCardRole = data['rateCardJobRole']
        this.rateCardComplexityLevel= data['competencyLevel']
        this.calculateGP();

      })
    }

     // Get all PositionLocation
     readPositionLocation(){
      this.openPositionService.getPositionLocations().subscribe((data) => {
         this.positionLocation = data;
      });
    }

    // To Read the Open Position by JRSS
      listAllOpenPositions() {
        const status="Open";
        this.openPositionService.listAllOpenPositionsBYJRSS(this.candidateAccount, status,this.candidateJRSS).subscribe((data) => {
          this.openPositionsList = data;
      })
    }

}
