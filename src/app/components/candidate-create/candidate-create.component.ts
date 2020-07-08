import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Candidate } from './../../model/candidate';
import { CandidateContractor } from './../../model/candidateContractor';
import { UserDetails } from './../../model/userDetails';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { browserRefresh } from '../../app.component';
import * as CryptoJS from 'crypto-js';
import { UserResultWorkFlow } from './../../model/userResultWorkFlow';
import { ResultPageService } from './../../components/result-page/result-page.service';


@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.css']
})

export class CandidateCreateComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  candidateForm: FormGroup;
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

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private resultPageService: ResultPageService
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
      candidateResume: ['']
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

  // Getter to access form control
  get myForm(){
    return this.candidateForm.controls;
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
      this.resumeText
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
      this.resumeText
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
    console.log("in candidate-create.ts");
      if ( formDate > this.currDate) {
        window.confirm("Date Of Joining is a future date. Please verify.")
       } else {
        console.log("in candidate-create.ts");
        this.apiService.findUniqueUsername(this.candidateForm.value.email).subscribe(
          (res) => {
            console.log('res.count inside response ' + res.count)
           if (res.count > 0)
           {
              console.log('res.count inside if ' + res.count)
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
                  let userResultWokFlow = new UserResultWorkFlow(this.candidateForm.value.email, '',
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
            }}       
          }, (error) => {
      console.log(error);
    })
  }
  }
  }
}
}
