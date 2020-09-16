import { Router } from '@angular/router';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Question } from './../../model/questions';
import { UserAnswer } from './../../model/userAnswer';
import { QuizService } from './../../components/quiz/quiz.service';
import { ApiService } from './../../service/api.service';

import { FormGroup, FormControl } from "@angular/forms";
import { environment } from './../../../environments/environment';
import { TestConfigService } from './../../service/testconfig.service';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  public browserRefresh: boolean;
  answered:boolean=false;
  userName ="";
  quizNumber =0;
  index =  0;
  size = 1;
  count = 1;
	test:string="";
	userAnswerID = "";
	questionID = 0;
	array:any=[];	
	quizForm: FormGroup;
	disableBackButton:boolean=false;
  disableNextButton:boolean=true;
  jrss:any;
  technologyStream:any;
  band:any;
  candidateAccount:any;

  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  configDuration: number;
  noOfQuestions: number;
  questions:any = [];
  userAnswers:any = [];
  mode = 'quiz';
  diff: number = 0;
  remainingTime = '00:00';

  toggle = true; 		
  status = "Flag";
  timeLeft = '';
  isSubmittedAnswers:boolean = false;
  bandInt: number;
  complexityLevel:string = "";
  complexityLevelArray:any=[];
  questionObj: {};
  isLastelemnt:boolean = false;
  temp ;
  
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private quizService: QuizService,
    private testconfigService: TestConfigService,
    private apiService: ApiService
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
      this.quizNumber = this.router.getCurrentNavigation().extras.state.quizNumber;
    }
    //Popup Alert when user moves away from the active application tab
	  document.addEventListener("visibilitychange", function() {		    
		if(document.visibilityState=='hidden')
	   {
		    confirm("Warning: we noticed that you attempted to move away from this tab/browser during the exam. Please refrain from doing so till you finish the exam.");
	   }
    console.log( document.visibilityState+" is/was the visibility state of the exam tab");  
    });
  }

  //Story#8 - function to set flagged status
  flagQuestion(index) {
		if (this.questions.slice(index)[0].flagged === true) {
			this.toggle = true;
		} else {
			this.toggle = !this.toggle;
		}
		this.status = this.toggle ? "Flag" : "Unflag";				
		this.questions.slice(index)[0].flagged=!this.toggle;
    } // end of flagQuestion
    
ngOnInit() {
  if (this.browserRefresh) {
      window.confirm('Your account is deactivated. You need to contact administrator to login again.');
      this.router.navigate(['/login-component']);
  }
  this.loadQuestions();
  this.startTime = new Date();
  this.ellapsedTime = '00:00';
  this.timer = setInterval(() => { if ( this.ellapsedTime !== this.duration) {this.timeLeftTick()}; }, 1000);
  this.duration = this.parseTime(this.configDuration);
  this.mode = 'quiz';
	this.quizForm = new FormGroup({
	optionSelected : new FormControl()
  })
  }

 tick() {
     const now = new Date();
     this.diff = (now.getTime() - this.startTime.getTime()) / 1000;
     if (this.diff >= this.configDuration) {
       //Auto Submit
     }
     this.ellapsedTime = this.parseTime(this.diff);
     this.remainingTime = this.parseTime(this.configDuration - this.diff);

   }


   timeLeftTick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    const timeLeftSec = this.configDuration - diff;
    this.timeLeft = this.parseTime(timeLeftSec);
    if (timeLeftSec <= 0 && timeLeftSec>-1 && this.isSubmittedAnswers == false) {
      //Auto Submit
      this.submitAnswers(false);
    }
    }

   parseTime(totalSeconds: number) {
     let mins: string | number = Math.floor(totalSeconds / 60);
     let secs: string | number = Math.round(totalSeconds % 60);
     mins = (mins < 10 ? '0' : '') + mins;
     secs = (secs < 10 ? '0' : '') + secs;
     return `${mins}:${secs}`;
   }

  loadQuestions() {
     // Get jrss
    this.apiService.getCandidateJrss(this.userName).subscribe(
    (res) => {      
      this.jrss=res['JRSS'];
      this.technologyStream=res['technologyStream'];
      this.band=res['band'];
      this.candidateAccount=res['account'];
      console.log("band values is " +this.band);
      console.log("the candidate account is " +this.candidateAccount);

      let str = this.band;
      str = this.band.substring(0, 1);
      this.bandInt = parseInt(str);
      this.questionObj = {};
      this.complexityLevel = "Complex";
      console.log("Band int value is " +this.bandInt);
      if(this.bandInt >=7 ){
         this.testconfigService.findTestConfigByJRSS(this.jrss).subscribe(
          (data) => {
          this.noOfQuestions = data['noOfQuestions'];
          console.log('No of question' +this.noOfQuestions);
          this.configDuration = data['testDuration']*60;
          this.quizService.getQuizQuestions(this.noOfQuestions, this.userName,this.technologyStream,this.complexityLevel,this.candidateAccount).subscribe(res => {
                 this.questions = res;
         }, (error) => {
         console.log(error);
         })
      }, (error) => {
          console.log(error);
      });
     } 
    //else start
     else{

      this.testconfigService.findTestConfigByJRSS(this.jrss).subscribe(
        (data) => {
          this.noOfQuestions = data['noOfQuestions'];
          this.configDuration = data['testDuration']*60;
          this.temp=this.noOfQuestions;
          this.isLastelemnt=false;

       var complexityLevelArray =['Simple', 'Medium', 'Complex'];
       complexityLevelArray.forEach(complexity =>{
       console.log("Complexity inside else " +complexity);
       
    let temp1=0;
    
    var last_element = complexityLevelArray[complexityLevelArray.length - 1];

    if ((last_element===complexity) && !(this.isLastelemnt))
    {
      this.isLastelemnt=true;
      console.log(" loop is at the last iteration");
    }
  
    if((complexity === "Simple" ) && !(this.isLastelemnt)){
     temp1 = Math.round(this.noOfQuestions * 0.4);
      this.temp = this.temp - temp1;
       }
    
 if((complexity === "Medium") && !(this.isLastelemnt)){
    temp1 = Math.round(this.noOfQuestions * 0.3);
      this.temp = this.temp - temp1;
      }
  
  if((complexity === "Complex") && !(this.isLastelemnt)){
    temp1 = Math.round(this.noOfQuestions * 0.3);
      this.temp = this.temp - temp1;
     } 
   
    let currentsetq;
      if (this.isLastelemnt)
      {
        currentsetq=this.temp;
      }
      else
      {
        currentsetq=temp1;
      }
       
         this.quizService.getQuizQuestions(currentsetq, this.userName,this.technologyStream,complexity,this.candidateAccount).subscribe(res => {
           
            //create a temparary array of questions for the responses received 
            let tempQuestions:any = [];
            tempQuestions=res;
          //loop through each question and add that to a final array of questions
            tempQuestions.forEach(element => {
              this.questions.push(element);
              console.log("element ** ", element)

            });

    }, (error) => {
    console.log(error);
    })
  
    }
    ,(error) => {
        console.log(error);
    });//
  
     
    });
  

}
//else end

 
       })
      
    this.questions.forEach((question) => { 
		question.options.forEach((option) => { option.checked = ""; });
	  });
  } //end of loadQuestion()

  //This method determines whether questions are answered or not answered
   isAnswered(question: Question) {
        return question.options.find(option => option.checked) ? 'Answered' : 'Not Answered';
    };

    //This method determines whether questions are flagged or not
   isFlagged(question: Question) {
        return (question.flagged === true) ? 'Flagged' : 'Not Flagged';
   };
   get questionOneByeOne() {
    return (this.questions) ?
      this.questions.slice(this.index, this.index + this.count) : [];
  }
  
  goTo(index: number) {
      if (index >= 0 && index < this.questions.length) {
        this.index = index;
        this.mode = 'quiz';
      }
      this.disableBackButton=false;
      this.disableNextButton=true;
      if (this.index >= 1) {
         this.disableBackButton=true;
      }
      if (this.index != 0 && this.index >= (this.questions.length -1)) {
         this.disableNextButton=false;
      }
      if (this.questions.slice(index)[0].flagged === true) {
      			this.status = "Unflag";
      		} else {
      			this.status = "Flag";
      }
    }
  
  moveQuestion(index, size) {
    this.index = index;
	  this.size=size;
	  this.disableBackButton=false;
    this.disableNextButton=true;
    this.toggle = true;

	  if (this.index >= 1) {
		  this.disableBackButton=true;
	  } 
	
	  if (this.index >= this.size-1) {
		  this.disableNextButton=false;
    } 
    
    // Story#8 - Code to set Flag/Unflag status
		if (this.questions.slice(index)[0].flagged === true) {
			this.status = "Unflag";
		} else {
			this.status = "Flag";
		}
  }  

    onSelect(question: Question, selectedOption: Number, checked) {
		if (question.questionType === "MultiSelect") {
			//console.log("checked *** ", question.options[2].option.checked);
			  question.options.forEach((i) => { 
				  if (i.optionID === selectedOption && checked === true) {i.checked = "checked";
				  }  
				  if (i.optionID === selectedOption && checked === false) {i.checked = "Unchecked";
				  }  
			  });
		  }
		  
		  	if (question.questionType === "SingleSelect") {
			//console.log("checked *** ", question.options[2].option.checked);
			  question.options.forEach((i) => { 
				  if (i.optionID === selectedOption && checked === true) {i.checked = "checked";
				  }  else {i.checked = "";}
			  });
		  }
   }

  submitAnswers(warning: boolean) {
  let userAnswer = new UserAnswer(null,null,null,null,null);
  this.questions.forEach((question) => {  
	this.questionID = question.questionID;
  this.userAnswerID ="";
  this.isSubmittedAnswers = true;

	question.options.forEach((option) => {
	if (option.checked === "checked")  {
		this.userAnswerID = this.userAnswerID +","+option.optionID;
		}
	})

  // Story#8 - Code to set default flagged value to false
  if(question.flagged == null || question.flagged == undefined || question.flagged == ""){
    question.flagged = false;
  }  
  
	this.array = this.userAnswerID.split(',')
	this.userAnswerID = (this.userAnswerID.length && this.userAnswerID[0] == ',') ? this.userAnswerID.slice(1) : this.userAnswerID;
	userAnswer.userAnswerID = this.userAnswerID ;
  userAnswer = new UserAnswer(this.userName,this.quizNumber, this.questionID, this.userAnswerID, question.flagged );
	let data = JSON.stringify( userAnswer );
		 this.quizService.saveAnswer(data).subscribe(
        (res) => {
          console.log('Answer successfully saved!');    
		      if(this.diff < this.configDuration && warning) {
		        this.mode = 'quiz';
		      } else {
            this.ngZone.run(() => this.router.navigateByUrl('/result-page',{state:{username:this.userName,quizNumber:this.quizNumber,mode:this.mode}}))
          } }, (error) => {
          console.log(error);
        });

  });
   
  }
  
  
 /** 
  This method will be invoked on click of finish button.
  This method check whether all questions have been answered or not. 
  If not, need to go back and answer all the questions. 
  otherwise, it will be redirected to submit page (mode=Warning).
 **/

 finish() {
  
  for (let ques of this.questions) {
	  this.answered = false;
	  this.mode = 'warning';
		for (let opt of ques.options) {
			if (opt.selected || opt.checked === "checked") {
				this.answered = true;
				break;
			}
	   
	   }
	   console.log("this.answered ***--> ", this.answered);
	   if (!this.answered) {
			this.mode = 'finish';
			break;
	   }
   }
 }
  
}
