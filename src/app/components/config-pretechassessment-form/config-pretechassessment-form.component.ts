import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  preTechQuestion;
  state = "Activate";
  questionNo ="Question 1:"
  error = "";
  quizNumber = 1;
  status = "";
  submitted = false;
  formReset = false;  
  JRSS:any = [];
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
    this.configPreTechForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    this.apiService.getJRSSPreTech(this.configPreTechForm.value.JRSS).subscribe((data) => {
      console.log("inside this.workFlowForm.value.JRSS", this. configPreTechForm.value.JRSS, data);
      this.preTechQuestion = data[0]['jrss_preTech'].length;
      console.log("in kkkk", this.preTechQuestion)     
      
      this.configPreTechForm.setValue({
        JRSS: data[0]['jrss'],
       
      });
    });
  }

  mainForm() {
    this.configPreTechForm = this.fb.group({
      jrss: ['', [Validators.required]]
    })
  }
  readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
     this.JRSS = data;
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
