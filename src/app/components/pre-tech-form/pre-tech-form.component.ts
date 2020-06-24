import { Router } from '@angular/router';
import { PreTechService } from './../../components/pre-tech-form/pre-tech-service';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { PreTechQuesAndAns } from './../../model/PreTechQuesAndAns';


@Component({
  selector: 'app-pre-tech-form',
  templateUrl: './pre-tech-form.component.html',
  styleUrls: ['./pre-tech-form.component.css']
})

export class PreTechFormComponent implements OnInit {

	
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
		});
    
 } //end of loadQuestion()

  downloadResume()
  {
    saveAs(this.resumeBlob,this.resumeName1);
  }

  addResume(event){
	this.candidateResume= event.target.files[0]; 
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
			//Resume upload call
			if(this.candidateResume){
				console.log("Resume is selected");
			}else{
				console.log("Resume is not selected");
			}
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
