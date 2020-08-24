import { Router } from '@angular/router';
import { PreTechService } from './../../components/pre-tech-form/pre-tech-service';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { PreTechQuesAndAns } from './../../model/PreTechQuesAndAns';
import { Candidate } from './../../model/candidate';
import { SendEmail } from './../../model/sendEmail';


@Component({
  selector: 'app-pre-tech-form',
  templateUrl: './pre-tech-form.component.html',
  styleUrls: ['./pre-tech-form.component.css']
})

export class PreTechFormComponent implements OnInit {

	smeUserList:any = [];
	smeUsersEmail: String = "";
	candidateName = "";
	result:any=[];
	
	preTechQuesAndAns: PreTechQuesAndAns[] = [];
	jrss = "";
	userName = "";
	stage2_status = "";
	
	stage2Completed=false;
	mode= "instructions";
	preTechAssmntQuestions:any = [];
	resumeBlob:Blob;
	resumeName1:string;
	resumeUploaded:boolean;
	candidateResume:File;
	candidate:Candidate;
 
  constructor(
    private router: Router,
    private ngZone: NgZone,
	private preTechService: PreTechService,
	private location: Location,
    private apiService: ApiService) {
this.userName = this.router.getCurrentNavigation().extras.state.userName;
this.mode = this.router.getCurrentNavigation().extras.state.mode;

	}
	
	 cancel() {
    this.location.back();
  } 
  
 preTech(){
   this.mode="pre-tech"
 }
logout(){	
	if(window.confirm("Proceed if you already saved your data!")){
		this.router.navigate(['/login-component']);
	}

}
 ngOnInit(): void {
	 this.getPreTechAssessmentQuestions();
	 this.downloadCandidateDetails();
	 this.readSmeUser();
	 	 
}

//Read the pre technical assessment questions (based on the given JRSS) to be filled by the candidate
getPreTechAssessmentQuestions() {


this.preTechService.getStageStatusByUserName(this.userName).subscribe(
    (res) => {      
      this.stage2_status = res['stage2_status'];
	  
	  if (this.stage2_status == "Completed") {
			this.stage2Completed =  true	  
	  }
	  });
	  
     // Get jrss
    this.apiService.getCandidateJrss(this.userName).subscribe(
    (res) => {      
	  this.jrss=res['JRSS'];
	  this.candidateName = res['employeeName'];
     
         this.preTechService.getPreTechAssessmentQuestions(this.jrss, this.userName).subscribe(res => {
		 
		 
		 this.preTechAssmntQuestions = res;
		 
		 this.preTechAssmntQuestions.forEach((quesAndAnswer) => { 
			
			var answer = "";
			if (quesAndAnswer.PreTechAnswers.length > 0) {
				answer = quesAndAnswer.PreTechAnswers[0].answer 
			 }
			this.preTechQuesAndAns.push(new PreTechQuesAndAns(quesAndAnswer.preTechQID, quesAndAnswer.jrss,
			quesAndAnswer.preTechQuestion,this.userName, answer));
						
	  });
		 
         }, (error) => {
         console.log(error);
         });
	});
} //end of loadQuestion()

downloadCandidateDetails()
{
	this.apiService.getCandidateJrss(this.userName).subscribe(data => {
		//Get resume Data
		this.resumeName1 = data['resumeName'];
		let resumeData1 : String = data['resumeData'];
		console.log("Resume Uploaded name: "+this.resumeName1);
		var byteString = atob(resumeData1.split(',')[1]);
		// separate out the mime component
		var mimeString = resumeData1.split(',')[0].split(':')[1].split(';')[0];
  
		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
		  ia[i] = byteString.charCodeAt(i);
		}
		this.resumeBlob =  new Blob([ab], {type: mimeString});
		
		if (this.resumeName1 == "ResumeEmpty.doc")
		{
		  this.resumeUploaded=false;
		}else{
		  this.resumeUploaded = true;
		}
		if (data['employeeType'] == 'Regular' || data['employeeType'] == undefined) {
			this.candidate = new Candidate(data['employeeName'],data['employeeType'],
			data['email'], data['band'], data['JRSS'], data['technologyStream'], data[ 'phoneNumber'], data['dateOfJoining'],
			data['createdBy'], data['createdDate'], data['updatedBy'], data['updatedDate'],
			data['username'], data['resumeName'], data['resumeData'], data['account'],
			data['userLOB'],data['grossProfit'],data['userPositionLocation'],data['openPositionName'],data['positionID']);
		  }
		  if (data['employeeType'] == 'Contractor') {
			this.candidate = new Candidate(data['employeeName'],data['employeeType'],
			data['email'], '', data['JRSS'], data['technologyStream'], data[ 'phoneNumber'], data['dateOfJoining'],
			data['createdBy'], data['createdDate'], data['updatedBy'], data['updatedDate'],
			data['username'], data['resumeName'], data['resumeData'], data['account'],'','','','','');
		  }
		});
    
 } 

  downloadResume()
  {
    saveAs(this.resumeBlob,this.resumeName1);
  }

  addResume(event){
	this.candidateResume= event.target.files[0]; 
  }
 
 uploadResume(){
	 //Resume upload call
	 if(this.candidateResume){
		console.log("Resume is selected");
		//Set Resume Name
		this.candidate.resumeName=this.candidateResume.name;
		console.log("New resume uploaded: "+this.candidate.resumeName);
		//Set updatedBy and updatedDate
		this.candidate.updatedBy=this.userName;
		this.candidate.updatedDate=new Date();

		let reader = new FileReader();
		reader.readAsDataURL(this.candidateResume);
		reader.onload = (e) => {    
		console.log("this.candidate.resumeData inside loop: "+reader.result);
		//Set Resume Data
		this.candidate.resumeData=<String>reader.result;
		//Calling API service to update resume based on username
		this.apiService.updateCandidateResume(this.userName,this.candidate).subscribe(
			(res) => {    
				window.alert("Resume is successfully uploaded");
				console.log("Candidate Resume updated from Pre_Tech Form");
				(<HTMLInputElement>document.getElementById('resumeFile')).value = "";
				this.downloadCandidateDetails();
			  }
			);
		}

	}else{
		console.log("Resume is not selected");
		window.alert("Please select a resume.");
	};

 }

 readSmeUser(){
	this.apiService.getUserByRole('sme').subscribe((data) => {
  this.smeUserList = data;
  for (var smeEmail of this.smeUserList){
    if(this.smeUsersEmail == ""){
	  this.smeUsersEmail = smeEmail.username;
    }else{
	  this.smeUsersEmail = this.smeUsersEmail + ", "+smeEmail.username;
    }
  }
	})
 }
 
 submitPreTechForm( preTechQAndA : PreTechQuesAndAns[]) {
 console.log("******* mode ****** ",this.mode);
 
     this.preTechService.saveOrSubmitPreTechAssmentDetails(preTechQAndA).subscribe(res => {

         }, (error) => {
         console.log(error);
         });
		 
		 if (this.mode == 'Submit') {
		 
			this.preTechService.updateStage2Status(this.userName).subscribe(
			(res) => {      
				console.log("Updated stage 2 status to Completed");
			  }
			);
			this.stage2Completed =  true;

			//Send email notification to SME
			let fromAddress = "Talent.Sourcing@in.ibm.com";
			let toAddress = this.smeUsersEmail;
			let emailSubject = "Candidate assignment notification in Talent Sourcing Tool: SME evaluation pending"; 
			let emailMessage = "Dear Team,<br><br> \
			We would like to notify that the candidate "+this.candidateName+" is added to the queue for the job role " +this.jrss+".<br>\
			Please assess the candidate for the new project assignment.<br>\
			<p>Regards, <br>DWP Operations Team</p>"; 


				   // Send notification to the SME user
				   let sendEmailObject1 = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
				   this.apiService.sendEmail(sendEmailObject1).subscribe(
					 (res) => {
						 console.log("Email sent successfully to " + this.smeUsersEmail);            
					 }, (error) => {
						 console.log("Error occurred while sending email to " + this.smeUsersEmail);
						 console.log(error);
				   });

		} else {
		
		this.stage2Completed = false;
		alert("Information saved as draft");
		
		}
		
 }
 
 
 //Close will logout the candidate from the application
 close( ) {
this.router.navigate(['/login-component']);	
 
 }
 
 }
