import { Component, OnInit, ɵConsole } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Workflow } from './../../model/workflow';
import { browserRefresh } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workflow-config',
  templateUrl: './workflow-config.component.html',
  styleUrls: ['./workflow-config.component.css']
})
export class WorkflowConfigComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  workFlowForm: FormGroup;
  JRSS: any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  Account:any = [];
  AccountArray:any=[];
  loginAdminAccounts:any = [];

  jrssDocId: String = "";
  stage1: boolean = false;
  stage2: boolean = false;
  stage3: boolean = false;
  stage4: boolean = false;
  stage5: boolean = false;
  preTechQuestion;

  constructor(public fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.loginAdminAccounts = this.account.split(",");
    }
    this.mainForm();
    this.readAccount();
    }

  ngOnInit(): void {
  }

  // Choose account with select dropdown
  updateAccountProfile(e){
    this.workFlowForm.get('account').setValue(e, {
    onlySelf: true
    })
    this.apiService.getJrsssByAccount(e).subscribe((data) => {
      this.JRSS = data;
      this.workFlowForm.get('stage1OnlineTechAssessment').setValue(false);
      this.workFlowForm.get('stage2PreTechAssessment').setValue(false);
      this.workFlowForm.get('stage3TechAssessment').setValue(false);
      this.workFlowForm.get('stage4ManagementInterview').setValue(false);
      this.workFlowForm.get('stage5ProjectAllocation').setValue(false);
    });
  }

  updateJrssProfile(e) {
    this.workFlowForm.get('JRSS').setValue(e.value, {
      onlySelf: true
    })
    this.apiService.getJRSSPreTech(this.workFlowForm.value.JRSS).subscribe((data) => {
      this.preTechQuestion = data[0]['jrss_preTech'].length;
      if (data[0]['stage1_OnlineTechAssessment']) {
        this.stage1 = data[0]['stage1_OnlineTechAssessment'];
      } else {
        this.stage1 = false;
      }
      if (data[0]['stage2_PreTechAssessment']) {
        this.stage2 = data[0]['stage2_PreTechAssessment'];
      } else {
        this.stage2 = false;
      }
      if (data[0]['stage3_TechAssessment']) {
        this.stage3 = data[0]['stage3_TechAssessment'];
      } else {
        this.stage3 = false;
      }
      if (data[0]['stage4_ManagementInterview']) {
        this.stage4 = data[0]['stage4_ManagementInterview'];
      } else {
        this.stage4 = false;
      }
      if (data[0]['stage5_ProjectAllocation']) {
        this.stage5 = data[0]['stage5_ProjectAllocation'];
      } else {
        this.stage5 = false;
      }
      this.workFlowForm.setValue({
        JRSS: data[0]['jrss'],
        account:data[0]['account'],
        stage1OnlineTechAssessment: this.stage1,
        stage2PreTechAssessment: this.stage2,
        stage3TechAssessment: this.stage3,
        stage4ManagementInterview: this.stage4,
        stage5ProjectAllocation: this.stage5
      });
    });
  }

  preTechQuestionCheck(event) {
    if (this.preTechQuestion <= 0) {
      event.checked = false;
      window.alert("There are no Pre-technical Questions configured for this Job role");
      this.workFlowForm.get('stage2PreTechAssessment').setValue(false);
    }
  }
  // Getter to access form control
  get myForm() {
    return this.workFlowForm.controls;
  }

  mainForm() {
    this.workFlowForm = this.fb.group({
      account: ['',[Validators.required]],
      JRSS: ['', [Validators.required]],
      stage1OnlineTechAssessment: [false],
      stage2PreTechAssessment: [false],
      stage3TechAssessment: [false],
      stage4ManagementInterview: [false],
      stage5ProjectAllocation: [false]
    })
  }
  // Get all Acconts
  readAccount(){
    this.apiService.getAccounts().subscribe((data) => {
    this.Account = data;
    //Remove 'sector' from Account collection
    this.AccountArray.length=0;
    for (var accValue of this.Account){
        if(accValue.account !== 'SECTOR') {
          for (var loginAdminAccount of this.loginAdminAccounts){
            if(accValue.account == loginAdminAccount) {
              this.AccountArray.push(accValue.account);
            }
          }
        }
    }
    })
  }

  readJrssDocId() {
    for (var jrss of this.JRSS) {
      if (jrss.jrss == this.workFlowForm.value.JRSS) {
        this.jrssDocId = jrss._id;
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.formReset = false;
    this.readJrssDocId();
    if (!this.workFlowForm.valid) {
      return false;
    } else {

      let workflow = new Workflow(this.workFlowForm.value.stage1OnlineTechAssessment,
        this.workFlowForm.value.stage2PreTechAssessment,
        this.workFlowForm.value.stage3TechAssessment,
        this.workFlowForm.value.stage4ManagementInterview,
        this.workFlowForm.value.stage5ProjectAllocation);
        console.log("this.workFlowForm.value.stage2PreTechAssessment,",this.workFlowForm.value.stage2PreTechAssessment,)
      this.apiService.updateWorkflow(this.jrssDocId, workflow).subscribe(res => {
        console.log('Workflow details updated successfully!');
        alert('Workflow details added successfully');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/workflow-config'] , { state: { username: this.userName,account: this.account,accessLevel: this.accessLevel }}));
      }, (error) => {
        console.log(error);
      })
    }

  }


clearForm() {
  this.formReset = true;
  this.workFlowForm.reset();
}

}
