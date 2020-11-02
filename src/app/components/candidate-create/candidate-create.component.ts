import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { OpenPositionService } from './../../service/openposition.service';
import { Candidate } from './../../model/candidate';
import { CandidateContractor } from './../../model/candidateContractor';
import { UserDetails } from './../../model/userDetails';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { browserRefresh } from '../../app.component';
import * as CryptoJS from 'crypto-js';
import { UserResultWorkFlow } from './../../model/userResultWorkFlow';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { SendEmail } from './../../model/sendEmail';
import { TestConfigService } from './../../service/testconfig.service';


@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.css']
})

export class CandidateCreateComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  candidateForm: FormGroup;
  myOpenPositionGroup: FormGroup;
  JRSS:any = [];
  JRSSFull:any = [];
  Band:any = [];
  quizNumber: number;
  userName: String = "admin";
  password: String = "";
  currDate: Date ;
  technologyStream:any= [];
  skillArray:any= [];
  resume: File;
  resumeText: any;
  EmployeeType:any = ['Regular','Contractor'];
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  passingScore;
  stage1;
  stage2;
  stage3;
  stage4;
  stage5;
  OpenPositions: any = [];
  lineOfBusiness:any;
  positionID:any;
  competencyLevel:any;
  positionLocation:any;
  UserPositionLocation:any = [];
  rateCardJobRole:any;
  OpenPosition: any= [];
  UserLOB: any = [];
  displayGPCalculate: boolean = false;
  Account:any = [];
  AccountArray:any=[];
  account;
  accessLevel;
  grossProfit: any;
  gpCount: number = 0;
  gp:any;
  displayPositionDetails = false;
  testConfigJRSS:any = []; 

  constructor(private testconfigService: TestConfigService,public fb: FormBuilder,private router: Router,private ngZone: NgZone,
    private apiService: ApiService,private resultPageService: ResultPageService,
    private openPositionService: OpenPositionService) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      }
      this.password = appConfig.defaultPassword;
      this.quizNumber = 1;
      this.readBand();
      this.mainForm();
      this.mainOpenForm();
      this.readUserPositionLocation();
      this.readUserLineOfBusiness();
      this.readAccount();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
  }

  mainForm() {
    this.candidateForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      employeeType: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      band: [''],
      JRSS: ['', [Validators.required]],
      technologyStream:['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateOfJoining: ['', Validators.required],
      candidateResume: [''],
      account: ['', [Validators.required]],
      userLOB: [''],
      userPositionLocation: ['']
    })
  }

  // Choose designation with select dropdown
  updateJrssProfile(e){
    this.candidateForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    // Get technologyStream from JRSS
    for (var jrss of this.JRSS){
      if(jrss.jrss == e){
        this.technologyStream = [];
        for (var skill of jrss.technologyStream){
          this.technologyStream.push(skill);

      }
    }
    }
    this.getOpenPositionDetails() ;

  }

  // Choose band with select dropdown
    updateBandProfile(e){
      this.candidateForm.get('band').setValue(e, {
      onlySelf: true
      })
      this.myOpenPositionGroup.get('gpUserBand').setValue(e);
      this.gpCount = 0;
    }

    // Choose band with select dropdown
    updateGPUserBandProfile(e){
      this.myOpenPositionGroup.get('gpUserBand').setValue(e, {
      onlySelf: true
      })
      this.gpCount = 1;
    }

  // Choose employee type with select dropdown
  updateEmployeeTypeProfile(e){
    this.candidateForm.get('employeeType').setValue(e, {
    onlySelf: true
    })

    if (this.candidateForm.value.employeeType == 'Contractor') {
        this.displayContractorUIFields = true;
        this.displayRegularUIFields = false;
    } else {
       this.displayContractorUIFields = false;
       this.displayRegularUIFields = true;
    }
  }

    // Get all Bands
    readBand(){
       this.apiService.getBands().subscribe((data) => {
       this.Band = data;
       })
    }

    // Get all Acconts
    readAccount(){
      this.AccountArray = this.account.split(",");
    }

    // Choose account with select dropdown
    updateAccountProfile(e){            
      //Get test config JRSS based on account
      this.testconfigService.findTestConfigJRSSByAccount(e).subscribe((res) => {            
        this.testConfigJRSS = [];     
        for (var jrss of res){ 
          this.testConfigJRSS.push(jrss.JRSS);         
        }
        }, (error) => {
           console.log(error);
      });

      this.candidateForm.get('account').setValue(e, {
      onlySelf: true
      })
      this.JRSS.length=0;
      this.JRSSFull.length=0;
      this.apiService.getJrsssByAccount(e).subscribe((data) => {
          this.JRSSFull = data;
          for(var i=0; i<this.JRSSFull.length; i++) {
            let workFlowPrsent = ((this.JRSSFull[i]['stage1_OnlineTechAssessment']==undefined) ||
            ((this.JRSSFull[i]['stage1_OnlineTechAssessment']==false) &&
            (this.JRSSFull[i]['stage2_PreTechAssessment']==false) &&
            (this.JRSSFull[i]['stage3_TechAssessment']==false) &&
            (this.JRSSFull[i]['stage4_ManagementInterview']==false) &&
            (this.JRSSFull[i]['stage5_ProjectAllocation']==false)))
            if (!workFlowPrsent){
              // For any JRSS, if the first stage (Online test) is skipped AND even if there is no test configuration 
              //configured, then display such JRSS in the JRSS dropdown on UI screen
              if (this.testConfigJRSS.includes(this.JRSSFull[i]['jrss']) || this.JRSSFull[i]['stage1_OnlineTechAssessment']==false){                
                this.JRSS.push(this.JRSSFull[i]);                
              }                        
            }
          
          }
      });
    }

   // Get all User Line of business
    readUserLineOfBusiness(){
       this.openPositionService.getLineOfBusiness().subscribe((data) => {
        this.UserLOB = data;
       })
    }
    //Update Userline of business
    updateUserLOBProfile(e) {
        this.candidateForm.get('userLOB').setValue(e, {
          onlySelf: true
        })

        this.apiService.readBandsByLOB(e).subscribe((data) => {
          this.Band = data
        })
        this.myOpenPositionGroup.get('gpUserLOB').setValue(e);
        this.gpCount = 0;
    }

    //Update Userline of business
    updateGPUserLOBProfile(e) {
        this.myOpenPositionGroup.get('gpUserLOB').setValue(e, {
          onlySelf: true
        })
        this.apiService.readBandsByLOB(e).subscribe((data) => {
          this.Band = data
        })
        this.gpCount = 1;
    }

  // Getter to access form control
  get myForm(){
    return this.candidateForm.controls;
  }

  // Getter to access form control
  get myOpenForm(){
    return this.myOpenPositionGroup.controls;
  }

  //Exit
  canExit(): boolean{
    if (this.candidateForm.dirty && !this.submitted){
      if(window.confirm("You have unsaved data in the Create Candidate form. Please confirm if you still want to proceed to new page")){
        return true;
      } else {
      return false;
      }
    } else {
      return true;
    }
  }

  //Add Resume
  addResume(event) {
    this.resume= event.target.files[0];
  }

  // Submit button
  onSubmit() {
    this.submitted = true;
    this.formReset = false;
    // Encrypt the password
    var base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
    var ivMode = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    this.password = CryptoJS.AES.encrypt(appConfig.defaultPassword.trim(),base64Key,{ iv: ivMode }).toString();
    this.password = this.password.replace("/","=rk=");
    // Technology Stream
    if( typeof(this.candidateForm.value.technologyStream) == 'object' ) {
      this.candidateForm.value.technologyStream = this.candidateForm.value.technologyStream.join(',');
    }
    //Check if resume is not selected
    if(!this.resume){
      let bufferLength = 10;
      let ab = new ArrayBuffer(bufferLength);
      let resumeBlob : any;
      resumeBlob =  new Blob([ab], {type: "application/octet-stream"});
      resumeBlob.name =  "ResumeEmpty.doc";
      this.resume = resumeBlob;
      console.log("Resume not selected");
    }
    let reader = new FileReader();
    reader.readAsDataURL(this.resume);
    reader.onload = (e) => {
    this.resumeText = reader.result;
    let candidate;
    if (this.candidateForm.value.employeeType == 'Regular' ) {
      candidate = new Candidate(this.candidateForm.value.employeeName,this.candidateForm.value.employeeType,
      this.candidateForm.value.email,
      this.candidateForm.value.band,
      this.candidateForm.value.JRSS,
      this.candidateForm.value.technologyStream,
      this.candidateForm.value.phoneNumber,
      this.candidateForm.value.dateOfJoining,
      this.userName,
      new Date(),
      this.userName,
      new Date(),
      this.candidateForm.value.email,
      this.resume.name,
      this.resumeText,
      this.candidateForm.value.account,
      this.candidateForm.value.userLOB,
      this.grossProfit,
      this.candidateForm.value.userPositionLocation,
      this.myOpenPositionGroup.value.positionName,
      this.myOpenPositionGroup.value.positionID
      );
    }
    if (this.candidateForm.value.employeeType == 'Contractor' ) {
      candidate = new CandidateContractor(this.candidateForm.value.employeeName,this.candidateForm.value.employeeType,
      this.candidateForm.value.email,
      this.candidateForm.value.JRSS,
      this.candidateForm.value.technologyStream,
      this.candidateForm.value.phoneNumber,
      this.candidateForm.value.dateOfJoining,
      this.userName,
      new Date(),
      this.userName,
      new Date(),
      this.candidateForm.value.email,
      this.resume.name,
      this.resumeText,
      this.candidateForm.value.account
      );
    }

    let user = new UserDetails(this.candidateForm.value.email,
     this.password,
     this.quizNumber,
     "Active",
     "user",
     this.userName,
     new Date(),
     this.userName,
     new Date(),
     this.candidateForm.value.dateOfJoining,
     "false"
     );

     let formDate = new Date(this.candidateForm.value.dateOfJoining);
     this.currDate = new Date();
     console.log("this.candidateForm.valid", this.candidateForm.valid);
      if (!this.candidateForm.valid) {
        return false;
      } else {
        if (this.candidateForm.value.employeeType == 'Regular' ) {
            if (this.candidateForm.value.band == '' || this.candidateForm.value.userLOB == ''
                || this.candidateForm.value.userPositionLocation == '') {
            window.confirm("Please select Candidate Line Of Business/Candidate Location/Band");
            return false;
            }
        }
        if ( formDate > this.currDate) {
          window.confirm("Date Of Joining is a future date. Please verify.")
         } else {
          this.apiService.findUniqueUsername(this.candidateForm.value.email).subscribe((res) => {
             if (res.count > 0) {
                window.confirm("Please use another Email ID");
             } else {
              if (res.count == 0)
              {
                this.apiService.createUserDetails(user).subscribe((res) => {
                    console.log('User successfully created!')
                 }, (error) => {
                    console.log(error);
                 });
                this.apiService.createCandidate(candidate).subscribe((res) => {
                    console.log('Candidate successfully created!')
                    this.ngZone.run(() => this.router.navigateByUrl('/candidates-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
                }, (error) => {
                    console.log(error);
                })
                //Create Candidate details in Results collection, in case the Stage1 and Stage2 are skipped.
                this.apiService.getJrss(this.candidateForm.value.JRSS).subscribe((res) => {
                    if (res['stage1_OnlineTechAssessment']) {
                      this.stage1 = "Not Started";
                    } else {
                      this.stage1 = "Skipped";
                    }
                    if (res['stage2_PreTechAssessment']) {
                      this.stage2 = "Not Started";
                    } else {
                      this.stage2 = "Skipped";
                    }
                    if (res['stage3_TechAssessment']) {
                      this.stage3 = "Not Started";
                    } else {
                      this.stage3 = "Skipped";
                    }
                    if (res['stage4_ManagementInterview']) {
                      this.stage4 = "Not Started";
                    } else {
                      this.stage4 = "Skipped";
                    }
                    if (res['stage5_ProjectAllocation']) {
                      this.stage5 = "Not Started";
                    } else {
                      this.stage5 = "Skipped";
                    }
                    if (this.stage1 == 'Skipped') {
                    console.log("Stage 1 is skipped for this JRSS");
                    //Initializing the user Result workflow collection
                    let userResultWokFlow = new UserResultWorkFlow(this.candidateForm.value.email, '','',
                    this.quizNumber, this.stage1, this.stage2, this.stage3, this.stage4, this.stage5);
                    //Create Collection in User table.
                    this.resultPageService.saveResult(userResultWokFlow).subscribe((res) => {
                        console.log('Results for the user have been successfully created if Stage 1 is skipped');
                      }, (error) => {
                        console.log(error);
                    });

                    //If the stage1 is 'Skipped' then the Candidate status should be made Inactive
                    // inorder to not to allow canidate to loging to the application

                    this.apiService.updateUsersStatus(candidate.username,'Inactive',this.userName).subscribe(
                      (res) => {
                        console.log('Status column updated successfully in Users table');                 
                      }, (error) => {                
                       console.log("Error found while updating status column of Users table - " + error);
                       }); 


                    } else {
                      console.log("Stage 1 is not skipped for this JRSS");
                      
                    }
                  });

                  //Send email notification for taking the assessment test given that candidate is created. Set Email parameters
                  let fromAddress = "talent.sourcing@in.ibm.com";
                  let toAddress = this.candidateForm.value.email;
                  let emailSubject = "Candidate Registration Successful in Talent Sourcing Tool";
                  let emailMessage = "Dear " + this.candidateForm.value.employeeName + ",<br><br> \
                  We would like to confirm, your details have been successfully registered in Talent Sourcing Tool, DWP.<br>\
                  To attend the online assessment test please login to the tool using below details.<br>\
                  Access link: <a href='url'>https://tatclientapp.mybluemix.net</a><br>\
                  User Name : " +this.candidateForm.value.email+ "<br>\
                  Defalut Password : welcome <br>\
                  Please change the default password when you login for first time and then go ahead with the online test<br>&emsp;&emsp;&emsp;\
                  <p>Regards, <br>"+this.candidateForm.value.account+ " Operations Team";

                    // Send notification to the candidate
                    let sendEmailObject = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
                    this.apiService.sendEmail(sendEmailObject).subscribe(
                      (res) => {
                          console.log("Email sent successfully to " + this.candidateForm.value.email);
                      }, (error) => {
                          console.log("Error occurred while sending email to " + this.candidateForm.value.email);
                          console.log(error);
                    });


              }}
            }, (error) => {
        console.log(error);
    })
  }
  }
  }
}
    //get all open positions
    getOpenPositionDetails() {
        let status = "Open";
        if (this.candidateForm.value.JRSS == '') {
          window.alert("Please select candidate Job Role");
          this.displayGPCalculate = false;
          return false;
        } else {
            this.displayGPCalculate = true;
            this.openPositionService.listAllOpenPositionsBYJRSS(this.candidateForm.value.account, status,this.candidateForm.value.JRSS).subscribe((data) => {
            this.OpenPositions = data;
             this.displayPositionDetails = false;
             this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(this.candidateForm.value.userPositionLocation);
             this.myOpenPositionGroup.get('gpUserLOB').setValue(this.candidateForm.value.userLOB);
             this.myOpenPositionGroup.get('gpUserBand').setValue(this.candidateForm.value.band);
        })
        }
    }

    updateOpenPositionProfile(positionName) {
         this.openPositionService.readOpenPositionByPositionName(positionName).subscribe((data) => {
              this.lineOfBusiness = data['lineOfBusiness'];
              this.competencyLevel = data['competencyLevel'];
              this.positionLocation = data['positionLocation'];
              this.rateCardJobRole = data['rateCardJobRole'];
              this.positionID = data['positionID'];
            this.myOpenPositionGroup.setValue({
                  positionName: data['positionName'],
                  rateCardJobRole: data['rateCardJobRole'],
                  lineOfBusiness: data['lineOfBusiness'],
                  positionLocation: data['positionLocation'],
                  competencyLevel : data['competencyLevel'],
                  gpUserPositionLocation: this.candidateForm.value.userPositionLocation,
                  gpUserLOB: this.candidateForm.value.userLOB,
                  gpUserBand: this.candidateForm.value.band,
                  grossProfit: '',
                  positionID: data['positionID']

            });
              this.displayPositionDetails = true;
         })
    }

    mainOpenForm() {
        this.myOpenPositionGroup = new FormGroup({
          positionName: new FormControl(),
          rateCardJobRole: new FormControl(),
          lineOfBusiness: new FormControl(),
          positionLocation: new FormControl(),
          competencyLevel:new FormControl(),
          gpUserPositionLocation:new FormControl(),
          gpUserLOB:new FormControl(),
          gpUserBand:new FormControl(),
          grossProfit:new FormControl(),
          positionID: new FormControl()
        })
      }

      calculateGP(gpUserPositionLocation,userLOB,band,positionName) {
          if (gpUserPositionLocation == null || positionName == null || gpUserPositionLocation == '' || positionName == '') {
             window.alert("Please select Open Position/User Position Location");
             return false;
          }
          if (userLOB == null || band == null || userLOB == '' || band  == '') {
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
          console.log("RateCardCode ** : ",rateCardCode);
         this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
            rateCardValue = data['rateCardValue'];
             if (band == 'Exec' || band == 'Apprentice' || band == 'Graduate') {
              costCardCode = gpUserPositionLocation+" - "+userLOB+" - "+ band
             } else {
              costCardCode = gpUserPositionLocation+" - "+userLOB+" - Band-"+band
             }
              console.log("CostCardCode ** : ",costCardCode);
            this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
               costCardValue = data['costCardValue'];
               if (costCardValue == null || rateCardValue == null) {
                  window.alert("Candidate location and line of business are not compatible, please check the data and calculate GP again.");
                  return false;
               } else {
                  GP = Math.round(((rateCardValue-costCardValue)/costCardValue)*100)
               }
               if (this.gpCount == 0) {
                  this.grossProfit  = GP;
                  console.log("this.grossProfit",this.grossProfit);
               }
               this.gpCount = this.gpCount+1;
               this.myOpenPositionGroup.get('grossProfit').setValue(GP);
               this.gp = GP;
            })
         })
      }


      // Get all PositionLocation
      readUserPositionLocation(){
         this.openPositionService.getPositionLocations().subscribe((data) => {
            this.UserPositionLocation = data;
         })
      }

     // Choose user position location with select dropdown
     updateUserPositionLocationProfile(e){
       this.candidateForm.get('userPositionLocation').setValue(e, {
       onlySelf: true
       })
       this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(e);
       this.gpCount = 0;
     }

     // Choose user position location with select dropdown
    updateGPUserPositionLocationProfile(e){
      this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(e, {
      onlySelf: true
      })
      this.gpCount = 1;
    }

     //Reset
     resetForm(){
      this.formReset = true;
      this.candidateForm.reset();
      this.myOpenPositionGroup.reset();
     }

     //Cancel
     cancelForm(){
       this.ngZone.run(() => this.router.navigateByUrl('/candidates-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
     }

}
