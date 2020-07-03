import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { Component, OnInit, NgZone } from '@angular/core';

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
  status = "";
  submitted = false;
  formReset = false;  
  JRSS:any = [];
  preTechQuestions:any = [];
  preTechQuestionsObject:any = [];
  userName: String = "admin";
  jrssDocId: String = ""; 

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
    this.readPreTechQuestions();
    console.log("the current value of JRSS is "+this.configPreTechForm.value.JRSS)
    this.configPreTechForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    this.apiService.getJRSSPreTech(this.configPreTechForm.value.JRSS).subscribe((data) => {
      console.log("inside this.configPreTechForm.value.JRSS", this. configPreTechForm.value.JRSS, data);
      this.preTechQuestionCount = data[0]['jrss_preTech'].length;
      for(let i=1;i<=this.preTechQuestionCount;i++){
        this.containers.push(this.containers.length);
      }
      console.log("in kkkk", this.preTechQuestionCount);    
      for (var preTechQuestion of this.preTechQuestionsObject)
      {
        console.log("the jrss are "+preTechQuestion.jrss);
        
       if(preTechQuestion.jrss==this.configPreTechForm.value.JRSS)
       {
        for(let i=0;i<this.preTechQuestionCount;i++)
        {
          console.log("The q is "+preTechQuestion.preTechQuestion);
         this.preTechQuestions[i] = preTechQuestion.preTechQuestion;
        }
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
    this.containers.push(this.containers.length);
    console.log("The array length is "+this.containers.length);
    this.questionNo="Question"+this.containers.length+":";
  }

  removeLastQuestionTextbox()
  {
    this.containers.splice(-1,1)
  }

}
