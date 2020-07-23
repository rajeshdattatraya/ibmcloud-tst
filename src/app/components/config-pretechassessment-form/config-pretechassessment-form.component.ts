import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { Component, OnInit, NgZone } from '@angular/core';
import { appConfig } from './../../model/appConfig';
import { PreTechQuestion } from './../../model/preTechQuestion';

@Component({
  selector: 'app-config-pretechassessment-form',
  templateUrl: './config-pretechassessment-form.component.html',
  styleUrls: ['./config-pretechassessment-form.component.css']
})
export class ConfigPretechassessmentFormComponent implements OnInit {
  public browserRefresh: boolean;
  configPreTechForm: FormGroup;
  Jrss:any = [];
  Candidate:any = [];
  containers = [];
  config: any;
  preTechQuestionCount;
  state = "Activate";
  questionNo ="Question 1:"
  error = "";
  quizNumber = 1;
  index=0;
  status = "";
  submitted = false;
  formReset = false;  
  JRSS:any = [];
  preTechQuestions:any = [];
  preTechQuestionsObject:any = [];
  userName: String = "admin";
  jrssDocId: String = ""; 
  preTechQuestionsFormArray = new FormArray([]);
  constructor(
    public fb: FormBuilder,
      private router: Router,
      private ngZone: NgZone,
      private apiService: ApiService
  ) 
  { 
    this.readJrss();
    this.mainForm();
   
  }

  ngOnInit(): void {
  }

  updateJrssProfile(e) {       
    console.log("1:the current value of JRSS is "+this.configPreTechForm.value.JRSS)
    this.readPreTechQuestions();
    console.log("2:the current value of JRSS is "+this.configPreTechForm.value.JRSS)
    this.configPreTechForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    this.apiService.getJRSSPreTech(this.configPreTechForm.value.JRSS).subscribe((data) => {
      console.log("inside this.configPreTechForm.value.JRSS", this.configPreTechForm.value.JRSS, data);
      this.preTechQuestionCount = data[0]['jrss_preTech'].length;
      for(let i=1;i<=this.preTechQuestionCount;i++){
        this.containers.push(this.containers.length);
       //this.preTechQuestionsFormArray.push(new FormControl(''));
      }
      console.log("the no of questions is ", this.preTechQuestionCount);    
      for (var preTechQuestion of this.preTechQuestionsObject)
      {
       //console.log("the jrss is "+preTechQuestion.jrss);        
       if(preTechQuestion.jrss==this.configPreTechForm.value.JRSS)
       {
       //for(let i=0;i<this.preTechQuestionCount;i++)        
        console.log("The q is "+preTechQuestion.preTechQuestion);
        this.preTechQuestionsFormArray.push(new FormControl(preTechQuestion.preTechQuestion));
        this.preTechQuestions.push(preTechQuestion.preTechQuestion);
        console.log("1.The questions are "+this.preTechQuestions);
        console.log("2.The questions are "+this.preTechQuestionsFormArray);
        //this.containers.push(this.containers.length);
        
       }
      }   
      this.configPreTechForm.setValue({
      JRSS: data[0]['jrss'], 
      QuestionTextbox: this.preTechQuestions     
     });
      
    });
    
  }

  mainForm() {
    this.configPreTechForm = this.fb.group({
      JRSS: ['', [Validators.required]],      
      QuestionTextbox: this.fb.array([this.preTechQuestionCount])
    })
  }

  readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
     this.JRSS = data;
    })
  } 


  readPreTechQuestions(){
    console.log("this.configPreTechForm.value.JRSS is "+this.configPreTechForm.value.JRSS)
    this.apiService.getpreTechQuestions(this.configPreTechForm.value.JRSS).subscribe((data) => {
     this.preTechQuestionsObject = data;
    })
  }

   // Getter to access form control
   get myForm(){
    return this.configPreTechForm.controls;
  }

  
  addNewQuestionTextbox() {
    this.preTechQuestionsFormArray.push(new FormControl(''));
    this.containers.push(this.containers.length);
    console.log("The array length is "+this.containers.length);
    this.questionNo="Question"+this.containers.length+":";
  }

  removeLastQuestionTextbox()
  {
    this.preTechQuestionsFormArray.removeAt(this.containers.length);
    this.containers.splice(-1,1)
  }


  onSubmit() {
  if (!this.configPreTechForm.valid) {
    return false;
  } else
  {
    //.log("The questions are "+this.configPreTechForm.value.preTechQuestionsFormArray);
    //console.log("1) The Form Array are   "+this.preTechQuestionsFormArray.value);
    //console.log(" The first element of Form Array are   "+this.preTechQuestionsFormArray.at(0).value);
    //console.log("The length is "+this.preTechQuestionsFormArray.length)
      
    for (var preTechQID of this.preTechQuestionsObject)
    {
     this.index=preTechQID.preTechQID - 1;
      //console.log("the index is "+this.index);
      //console.log("the object values "+ preTechQID.preTechQuestion);
      //this.apiService.findPretechQuestionbyQIDandJRSS(preTechQID.preTechQID, preTechQID.jrss)
      //if(this.configPreTechForm.value.JRSS==preTechQID.jrss)
      //console.log("The pretechQID is "+preTechQID.preTechQID);
      //console.log("The pretechQID is "+preTechQID._id);
      //console.log("The jrss is "+preTechQID.jrss);  
      //console.log(" The first element of Form Array are   "+this.preTechQuestionsFormArray.at(this.index).value);

      if(preTechQID.preTechQuestion===this.preTechQuestionsFormArray.at(this.index).value)
      {
        console.log("No changes to the pre-tech questions!");
      }
      else{
        //date = new Date();
        console.log("here");
        let pretechquestion = new PreTechQuestion(preTechQID.preTechQID, this.configPreTechForm.value.JRSS, this.preTechQuestionsFormArray.at(this.index).value,this.userName);
      
        this.apiService.updatePreTechQuestion(preTechQID._id,pretechquestion);

      }





    }

  }
  }

/*
  getPreTechAssessmentQuestions() {    
        
         // Get jrss
            
                   
             this.apiService.getJRSSPreTech(this.configPreTechForm.value.JRSS).subscribe(res => {
         
         
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
      
    }
    */

}
