import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import {TechnicalInterview} from './../../model/technicalinterview';
import { saveAs } from 'file-saver';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';
import { SendEmail } from './../../model/sendEmail';


@Component({
  selector: 'app-technical-interview',
  templateUrl: './technical-interview.component.html',
  styleUrls: ['./technical-interview.component.css']
})
export class TechnicalInterviewComponent implements OnInit {

  techskillForm: FormGroup;
  candidateInterviewDetails:any=[];
  technologyStreamArray:any= [];
  selectedTechStream:any=[];
  scoreArray:any=[];
  dynamicArray: any = [];
  newDynamic: any = {};
  JRSS:any;
   name: String="";
  totalScore:number=0;
  averageScore:number=0;
  scoreValueArray:any=[];
  submitted = false;
  formReset = false;
  userName: String = "";
  accessLevel: String = "";
  stage3_status: String = "";
  quizNumber:any;
  loginUser:string;
  resumeName1:string;
  resumeBlob:Blob;
  resumeUploaded:boolean;
  partnerUserList:any = [];
  partnerUsersEmail: String = "";
  jrss: String = "";
  candidateName: String = "";
  account: String = "";
  displayTechInterviewDetails: boolean = false;

  techStreamObj: any = {};
  candidateAccount: String = "";
  candidateDetails: any;

  constructor(private cv:TechnicalInterviewListComponent,private fb:FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
    private apiService: ApiService) {
    this.loginUser = this.router.getCurrentNavigation().extras.state.username;
    this.userName =this.actRoute.snapshot.paramMap.get('id');
    this.quizNumber =this.router.getCurrentNavigation().extras.state.quizId;
    this.account = this.router.getCurrentNavigation().extras.state.account; 
    this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    this.readCandidateTechnicalInterviewDetails(this.userName,this.quizNumber);
    this.getCandidate();
    this.techskillForm = this.fb.group({
        finalscore:'',
        finalResult:['',Validators. required],
        feedback:['',Validators. required],
        // smeName:['',Validators. required],
        techStream: this.fb.array([]) ,
      });
  }
  ngOnInit(): void {
    
    
    
    //this.readPartnerUserDet();
  }
  techStream() : FormArray {
      return this.techskillForm.get("techStream") as FormArray
  }

  skipMethod(){
    alert('Stage skipped');
  }
  //get user's name based on email id
  getCandidate(){
    this.apiService.getNameFromUsername(this.loginUser).subscribe( (res) => {
    this.name = res.name;        
  });
  }
   //To download candidate's CV if uploaded
  downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id) 
  }

  //Read candidate details
  readCandidateTechnicalInterviewDetails(id,quizId) {
    this.apiService.readTechInterviewDetails(id,quizId).subscribe(data => {
    
    this.candidateInterviewDetails=data;
	
	this.averageScore = this.candidateInterviewDetails[0].avgTechScore;
	
    this.getTechnicalStreamFromJRSS();
    

  }, (error) => {
      console.log(error);
    });
    this.displayTechInterviewDetails = true;
  }


  createTechStream(): FormGroup {
    return this.fb.group({
      technologyStream:this.getTechnologyStream(),
      score: '0'
    })
    }

  createstandByTechStream(technologyStream:string,score:string): FormGroup {
   
    return this.fb.group({
      technologyStream:technologyStream,
      score: score
    })

  }

   // Getter to access form control
   get myForm(){
    return this.techskillForm.controls;
  }

  getTechnicalStreamFromJRSS(){


//getJrss by Account will fetch the skills based on the candidate jrss
    this.apiService.getJrsssByAccount(this.candidateInterviewDetails[0].result_users[0].account).subscribe((data) => {
     this.JRSS = data;
      console.log("Jrss:"+JSON.stringify(this.JRSS));
     this.technologyStreamArray = [];
     for (var jrss of this.JRSS){
        for (var skill of jrss.technologyStream){
          this.technologyStreamArray.push(skill);
        }
      }

      //Remove duplicate skills
      this.technologyStreamArray = this.technologyStreamArray.filter((skill, index, self) =>
      index === self.findIndex((skl) => (
        skl.value === skill.value 
      ))
      
    )
    
      this.newDynamic =this.technologyStreamArray;
      this.dynamicArray.push(this.newDynamic);
     console.log("Dynamic Array:"+JSON.stringify(this.dynamicArray));
      //this.techStream().push(this.createTechStream());
      if (this.candidateInterviewDetails[0].smeScores !=  undefined && (this.candidateInterviewDetails[0].smeResult == "StandBy" || this.candidateInterviewDetails[0].smeResult == "Not Suitable")) {
        this.techskillForm = this.fb.group({
          finalscore:this.candidateInterviewDetails[0].avgTechScore,
          finalResult:[this.candidateInterviewDetails[0].smeResult,Validators. required],
          feedback:[this.candidateInterviewDetails[0].smeFeedback,Validators. required],
          // smeName:['',Validators. required],
          techStream: this.fb.array([]) ,
        });
        this.addStandByTechStreamAndScores(this.candidateInterviewDetails[0].smeScores);
      } else {
        this.techStream().push(this.createTechStream());
        }

      this.readCandidateNameAndJrss();
      
    })
  }



  getTechnologyStream() {
    console.log("this.technologyStreamArray  ***** ", this.technologyStreamArray)
    return this.technologyStreamArray;
  }



  // this.scoreValueArray=this.techskillForm.value.techStream;
  // var scoreCount:number=0;
  // for(var sc of this.scoreValueArray) {
  //  var score:number=parseInt(sc.score);
  //   if(score>0){
  //     this.totalScore= this.totalScore + score;
  //     scoreCount++;
  //   }
  // }

  changeSelectTechStream(i:number) {
    if(i<(this.newDynamic.length-1)){
     this.selectedTechStream=[];
     var selectedStream:any=[]=this.techskillForm.value.techStream;
      for(var sc of selectedStream){
        var technology=sc.technologyStream;
        this.selectedTechStream.push(sc.technologyStream);
        }
     }
    // this.validateTechStream();

  }


  errorIdx:any = [];
  errorMsg:any =[];
  validateTechStream() {
    let i = 0;
    for (var sc of this.techskillForm.value.techStream) {
      var technology = sc.technologyStream;
      if (technology instanceof Object && (sc.score <= 0 || sc.score > 10)) {
        this.techskillForm.controls.techStream.setErrors({ 'incorrect': true });
        this.errorMsg[i] = "Technology must be selected and the score must be between 1-10";
        this.errorIdx[i] = "ERROR";
      } else if (technology instanceof Object) {
        this.techskillForm.controls.techStream.setErrors({ 'incorrect': true });
        this.errorMsg[i] = "Technology Stream must be selected";
        this.errorIdx[i] = "ERROR";
      } else if (sc.score <= 0 || sc.score > 10) {
        this.techskillForm.controls.techStream.setErrors({ 'incorrect': true });
        this.errorMsg[i] = "Score must be between 1-10";
        this.errorIdx[i] = "ERROR";
      } else {
        this.errorIdx[i] = "";
      }

      i++;
    }

    //return false;
  }

  //Mymethod
  mode ="";
  addStandByTechStreamAndScores(standByTechStreamAndScores:any[]) {
     this.selectedTechStream=[];
     this.techStream().clear;
     this.mode ="Edit";
   
     var k =0;
     for(var standbyTechstream of standByTechStreamAndScores){
       this.techStream().push(this.createstandByTechStream(standbyTechstream.technologyStream, standbyTechstream.score));
       this.addTechStream(k);
       k++;
     }
     this.removeTechStream(k);
     this.mode ="";
 }


  // return this.techskillForm.get("techStream") as FormArray
  addTechStream(i:number) {

    if(i<(this.newDynamic.length-1)){
     this.selectedTechStream=[];
     var selectedStream:any=[]=this.techskillForm.value.techStream;
      for(var sc of selectedStream){
        var technology=sc.technologyStream;
        this.selectedTechStream.push(sc.technologyStream);
      }
      this.newDynamic =this.getTechnologyStream();
      this.dynamicArray.push(this.newDynamic);
      if(this.mode == ""){
        this.techStream().push(this.createTechStream());
      }
    }

    

  }

  removeTechStream(i:number) {

    if(this.dynamicArray.length ==1) {
        return false;
    } else {
        this.techStream().removeAt(i);
        this.dynamicArray.splice(i, 1);
        this.averageCalc("");
        return true;
    }


  }
  averageCalc(txtValue:string){
    this.totalScore=0;
    this.scoreValueArray=this.techskillForm.value.techStream;
    var scoreCount:number=0;
    for(var sc of this.scoreValueArray) {
     var score:number=parseInt(sc.score);
      if(score>0 && score <= 10){
        this.totalScore= this.totalScore + score;
        scoreCount++;
      } else {
          alert("Please enter score between 1-10");
      }
    }
    this.averageScore=Math.round((this.totalScore/scoreCount) *100 +Number.EPSILON)/100;
    if(isNaN(this.averageScore))
      this.averageScore=0;
      this.dynamicFormControlValidation();
   }

   //Reset
  resetForm(){
    this.formReset = true;
    this.techskillForm.reset();
    this.averageScore=0;
    var dynamicArrayLen:number=this.dynamicArray.length;
    for(var cnt=dynamicArrayLen;cnt>1;cnt--);
      this.removeTechStream(cnt);
    this.techskillForm.value.score=0;
   // this.ngZone.run(() => this.router.navigateByUrl('/technical-list',{state:{username:this.userName}}))
  }
//Cancel
 cancelForm(){
     this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.loginUser,accessLevel:this.accessLevel,account:this.account}}))
 }

 isNumber(evt,rowCount) {
  var iKeyCode = (evt.which) ? evt.which : evt.keyCode
  if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
      return false;
  var scoreValueArray1:any=[];
  var count:number=0;
  scoreValueArray1=this.techskillForm.value.techStream;
  for(var sc of scoreValueArray1){
    if(count==(parseInt(rowCount))){
      var score:number=0;
      score=parseInt(sc.score);
      if((score==1 && iKeyCode>48)){
      return false;
      }else if((score>1 && iKeyCode>47)){
        return false;
      }
    }
    count++;
  }
  return true;
}
 dynamicFormControlValidation(){
   if(this.averageScore==0){
     this.techskillForm.get("finalscore").setValidators([Validators.required])
     this.techskillForm.get("finalscore").updateValueAndValidity();
   }else{
    this.techskillForm.get("finalscore").clearValidators();
    this.techskillForm.get("finalscore").updateValueAndValidity();
   }
 }

 readPartnerUserDet(candidateAccount){
	this.apiService.getUserByRoleAndAccount('partner', candidateAccount).subscribe((data) => {
  this.partnerUserList = data;
  for (var partnerEmail of this.partnerUserList){
    if(this.partnerUsersEmail == ""){
      this.partnerUsersEmail = partnerEmail.username;
    }else{
      this.partnerUsersEmail = this.partnerUsersEmail + ", "+partnerEmail.username;
    }
  }
	})
 }

 readCandidateNameAndJrss(){
        this.apiService.getCandidateDetails(this.userName).subscribe(
          (res) => { 
            this.candidateDetails = res;  
            console.log("Candidate details:" +JSON.stringify(this.candidateDetails));   
          this.jrss=this.candidateDetails[0].candidate_jrss[0].jrss;
          this.candidateName = this.candidateDetails[0].employeeName;
          this.candidateAccount = this.candidateDetails[0].account;
          this.readPartnerUserDet( this.candidateDetails[0].account);
               }, (error) => {
               console.log(error);
               }
               );
               
 }

  onSubmit() {

  this.submitted = true;
  this.dynamicFormControlValidation();
  this.validateTechStream()

    if (!this.techskillForm.valid) {
      return false;
    } else {
      let userName=this.candidateInterviewDetails[0].userName;
      let userScore=this.candidateInterviewDetails[0].userScore;
      let quizNumber=this.candidateInterviewDetails[0].quizNumber;
      let updateId=this.candidateInterviewDetails[0]._id;
      if (this.techskillForm.value.finalResult === 'Recommended' || this.techskillForm.value.finalResult === 'Strongly Recommended') {
          this.stage3_status = 'Completed';
      } else if(this.techskillForm.value.finalResult === 'Not Suitable') {
        this.stage3_status = 'Not Suitable';
      } else {
          this.stage3_status = 'Not Started';
      }

          /* this.apiService.getResultByUser(userName,quizNumber).subscribe(res => {
          console.log('get the result data'+res['_id']+"\t"+ res['userName']+"\t"+updateId);*/
      let updateResults=new TechnicalInterview(userName,userScore, quizNumber,
      this.techskillForm.value.techStream,
      this.averageScore,
      this.techskillForm.value.finalResult,
      this.techskillForm.value.feedback,
      this.loginUser,
      this.stage3_status);

      this.apiService.updateResults(updateId,updateResults).subscribe(res => {
      console.log('Candidate SME Interview Details updated successfully!');
      window.alert("SME Interview Details saved successfully.");

      //Send email notification to partner when 'Recommended' or 'Strongly Recommended'	
      if(this.stage3_status == 'Completed'){
        let fromAddress = "talent.sourcing@in.ibm.com";
        let toAddress = this.partnerUsersEmail;    
        let emailSubject = "Candidate assignment notification in Talent Sourcing Tool: Partner evaluation pending";
        let emailMessage = "Dear Team,<br><br> \
        We would like to notify that the candidate "+this.candidateName+" is added to the queue for the job role " +this.jrss+".<br>\
        Please assess the candidate for the new project assignment.<br>\
        <p>Regards, <br>"+this.candidateAccount+" Operations Team</p>"; 
         	// Send notification to the SME user
				   let sendEmailObject2 = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
				   this.apiService.sendEmail(sendEmailObject2).subscribe(
					 (res) => {
						 console.log("Email sent successfully to " + this.partnerUsersEmail);            
					 }, (error) => {
						 console.log("Error occurred while sending email to " + this.partnerUsersEmail);
						 console.log(error);
				   }); 
      }

      this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.loginUser,accessLevel:this.accessLevel,account:this.account}}))
      }, (error) => {
      console.log(error);
      })
         /* }, (error) => {
          console.log(error);
      })*/
    }
  }

  exceptionalApproval(emailSelected, quizNumber) {
     if (window.confirm('Are you sure to provide exceptional approval?')) {
        if (this.techskillForm.value.feedback == "") {
          alert("Please enter feedback");
        } else {
          this.apiService.updateExceptionalApproval(emailSelected,quizNumber,this.techskillForm.value.feedback).subscribe(res => {
            window.alert('Successfully moved candidate to next stage');
            //Send email notification to partner when 'Recommended' or 'Strongly Recommended'
        let fromAddress = "talent.sourcing@in.ibm.com";
        let toAddress = this.partnerUsersEmail;
        let emailSubject = "Candidate assignment notification in Talent Sourcing Tool: Partner evaluation pending";
        let emailMessage = "Dear Team,<br><br> \
        We would like to notify that the candidate "+this.candidateName+" is added to the queue for the job role " +this.jrss+".<br>\
        Please assess the candidate for the new project assignment.<br>\
         <p>Regards, <br>"+this.candidateAccount+" Operations Team</p>";
         console.log('exceptionalApproval, before sending email, emailMessage == '+emailMessage);
         console.log('exceptionalApproval, before sending email, toAddress == '+toAddress);
         	// Send notification to the SME user
				   let sendEmailObject2 = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
				   this.apiService.sendEmail(sendEmailObject2).subscribe(
					 (res) => {
						 console.log("Email sent successfully to " + this.partnerUsersEmail);
					 }, (error) => {
						 console.log("Error occurred while sending email to " + this.partnerUsersEmail);
						 console.log(error);
				   });

            this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.loginUser,accessLevel:this.accessLevel,account:this.account}}))
          }, (error) => {
            console.log(error);
          })
        }
     }
  }

}