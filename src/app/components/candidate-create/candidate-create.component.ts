import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { OpenPositionService } from './../../service/openPosition.service';
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
  JRSS:any = []
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
  LineOfBusiness:any = [];
  CompetencyLevel:any = [];
  PositionLocation:any = [];
  UserPositionLocation:any = [];
  RateCardJobRole:any = [];
  OpenPosition: any= [];
  OJRSS: any= [];
  UserLOB: any = [];
  displayOpenPositionFields: boolean = false;
  Account:any = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private resultPageService: ResultPageService,
    private openPositionService: OpenPositionService
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
    }
    this.password = appConfig.defaultPassword;
    this.quizNumber = 1;
    this.readBand();
    this.mainForm();
    this.readJrss();
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
      userLOB: [''],
      band: [''],
      JRSS: ['', [Validators.required]],
      technologyStream:['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateOfJoining: ['', Validators.required],
      candidateResume: [''],
      account: ['', [Validators.required]]
    })
  }
 // Get all Jrss
 readJrss(){  
  this.apiService.getJRSS().subscribe((data) => {
  this.JRSSFull = data;
  for(var i=0; i<this.JRSSFull.length; i++)
  {
    let workFlowPrsent = ((this.JRSSFull[i]['stage1_OnlineTechAssessment']==undefined) ||
    ((this.JRSSFull[i]['stage1_OnlineTechAssessment']==false) &&
    (this.JRSSFull[i]['stage2_PreTechAssessment']==false) &&
    (this.JRSSFull[i]['stage3_TechAssessment']==false) &&
    (this.JRSSFull[i]['stage4_ManagementInterview']==false) &&
    (this.JRSSFull[i]['stage5_ProjectAllocation']==false)))
    if (!workFlowPrsent){
      this.JRSS.push(this.JRSSFull[i]);
    }
  }
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
    
  } 

  // Choose band with select dropdown
    updateBandProfile(e){
      this.candidateForm.get('band').setValue(e, {
      onlySelf: true
      })
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
      this.apiService.getAccounts().subscribe((data) => {
      this.Account = data;
      })
    }
    
    // Choose account with select dropdown
    updateAccountProfile(e){
      this.candidateForm.get('account').setValue(e, {
      onlySelf: true
      })
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
        if (this.candidateForm.value.userLOB == 'HCAM/Landed') {
            e = 'HCAM';
        }
        this.apiService.readBandsByLOB(e).subscribe((data) => {
          this.Band = data
        })
    }

  // Getter to access form control
  get myForm(){
    return this.candidateForm.controls;
  }

  // Getter to access form control
  get myOpenForm(){
    return this.myOpenPositionGroup.controls;
  }

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
  addResume(event)     
  {
  this.resume= event.target.files[0]; 
  }
  onSubmit() {
    this.submitted = true; 
    // Encrypt the password
    var base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
    var ivMode = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    this.password = CryptoJS.AES.encrypt(appConfig.defaultPassword.trim(),base64Key,{ iv: ivMode }).toString();
    this.password = this.password.replace("/","=rk=");    
     
    // Technology Stream
    this.skillArray = [];
    for (var stream of this.candidateForm.value.technologyStream)  {        
      if(this.skillArray.indexOf(stream.value == -1)){
          this.skillArray.push(stream.value);  
      }     
    }
    this.candidateForm.value.technologyStream = this.skillArray.join(',');    
    
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
      this.candidateForm.value.account
      );
    }
    console.log("this.candidateForm.value.employeeType",this.candidateForm.value.employeeType);

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
      if ( formDate > this.currDate) {
        window.confirm("Date Of Joining is a future date. Please verify.")
       } else {
        this.apiService.findUniqueUsername(this.candidateForm.value.email).subscribe(
          (res) => {
           if (res.count > 0)
           {
              window.confirm("Please use another Email ID");
            } 
            else 
            {
            if (res.count == 0)
            { this.apiService.createUserDetails(user).subscribe(
              (res) => {
                          console.log('User successfully created!')
                       }, (error) => {
                          console.log(error);
                       });
              this.apiService.createCandidate(candidate).subscribe(
              (res) => {
                          console.log('Candidate successfully created!')
                          this.ngZone.run(() => this.router.navigateByUrl('/candidates-list',{state:{username:this.userName}}))
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
                  //Initialzing the user Result workflow collection
                  let userResultWokFlow = new UserResultWorkFlow(this.candidateForm.value.email, '','',
                  this.quizNumber, this.stage1, this.stage2, this.stage3, this.stage4, this.stage5);
                  //Create Collecetion in User table.
                  this.resultPageService.saveResult(userResultWokFlow).subscribe(
                    (res) => {
                      console.log('Results for the user have been successfully created if Stage 1 is skipped');
                    }, (error) => {
                      console.log(error);
                    });
                  } else{
                    console.log("Stage 1 is not skipped for this JRSS");
                  }
                
                });


                 //Send email notification for taking the assessment test given that candidate is created.
                // Set Email parameters
                let fromAddress = "Talent.Sourcing@in.ibm.com";
                let toAddress = this.candidateForm.value.email;    
                let emailSubject = "Candidate Registration Successful in Talent Sourcing Tool";   
                let emailMessage = "Dear " + this.candidateForm.value.employeeName + ",<br><br> \
                We would like to confirm, your details have been successfully registered in Talent Sourcing Tool, DWP.<br>\
                To attend the online assessment test please login to the tool using below details.<br>\
                Access link: <a href='url'>https://tatclientapp.mybluemix.net</a><br>\
                User Name : " +this.candidateForm.value.email+ "<br>\
                Defalut Password : welcome <br>\
                Please change the default password when you login for first time and then go ahead with the online test<br>&emsp;&emsp;&emsp;\
                <p>Regards, <br>DWP Operations Team";    

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
        this.openPositionService.getAllOpenPositions().subscribe((data) => {
            this.OpenPositions = data;
        })
    }

    updateOpenPositionProfile(positionName) {
         this.openPositionService.readOpenPositionByPositionName(positionName).subscribe((data) => {
              this.LineOfBusiness.push(data['lineOfBusiness']);
              this.CompetencyLevel.push(data['competencyLevel']);
              this.PositionLocation.push(data['positionLocation']);
              this.RateCardJobRole.push(data['rateCardJobRole']);
              this.OJRSS.push(data['JRSS']);
            this.myOpenPositionGroup.setValue({
                  positionName: data['positionName'],
                  JRSS: data['JRSS'],
                  rateCardJobRole: data['rateCardJobRole'],
                  lineOfBusiness: data['lineOfBusiness'],
                  positionLocation: data['positionLocation'],
                  competencyLevel : data['competencyLevel'],
                  userPositionLocation: '',
                  grossProfit: ''

            });
            this.displayOpenPositionFields = true;
         })
    }

    mainOpenForm() {
        this.myOpenPositionGroup = new FormGroup({
          positionName: new FormControl(),
          JRSS: new FormControl(),
          rateCardJobRole: new FormControl(),
          lineOfBusiness: new FormControl(),
          positionLocation: new FormControl(),
          competencyLevel:new FormControl(),
          userPositionLocation:new FormControl(),
          grossProfit:new FormControl()
        })
      }

      calculateGP() {
        let GP: number = 0;
        let rateCardValue: number = 0;
        let costCardValue: number = 0;
        let costCardCode = ""
        let rateCardCode = ""
        rateCardCode = this.myOpenPositionGroup.value.lineOfBusiness+" - "+this.myOpenPositionGroup.value.positionLocation+" - "+
                       this.myOpenPositionGroup.value.rateCardJobRole+" - "+this.myOpenPositionGroup.value.competencyLevel;
       this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
          rateCardValue = data['rateCardValue'];
           if (this.candidateForm.value.band == 'Exec'
              || this.candidateForm.value.band == 'Apprentice'
              || this.candidateForm.value.band == 'Graduate') {
            costCardCode = this.myOpenPositionGroup.value.userPositionLocation+" - "+this.candidateForm.value.userLOB
                           +" - "+this.candidateForm.value.band
           } else {
            costCardCode = this.myOpenPositionGroup.value.userPositionLocation+" - "+this.candidateForm.value.userLOB
                            +" - Band-"+this.candidateForm.value.band
           }
          this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
             costCardValue = data['costCardValue'];
             GP = rateCardValue-costCardValue
             this.myOpenPositionGroup.get('grossProfit').setValue(GP);
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
       this.myOpenPositionGroup.get('userPositionLocation').setValue(e, {
       onlySelf: true
       })
     }

     //Reset
     resetForm(){
      this.formReset = true;
      this.candidateForm.reset();
      this.myOpenPositionGroup.reset();
     }

     //Cancel
     cancelForm(){
       this.ngZone.run(() => this.router.navigateByUrl('/candidates-list',{state:{username:this.userName}}))
     }

}
