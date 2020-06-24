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
  config: any;
  state = "Activate";
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

  updateJrssProfile(e){
    this.configPreTechForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
  }

  mainForm() {
    this.configPreTechForm = this.fb.group({
      jrss: ['', [Validators.required]]
    })
  }
  readJrss(){
    this.apiService.getJrsss().subscribe((data) => {
     this.Jrss = data;
    })
  } 

   // Getter to access form control
   get myForm(){
    return this.configPreTechForm.controls;
  }

}
