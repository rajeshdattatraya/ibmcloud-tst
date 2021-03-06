import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute,Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { ApiService } from './../../service/api.service';
import { OpenPositionService } from './../../service/openposition.service';
import { OpenPosition } from './../../model/openPosition';

@Component({
  selector: 'app-openpositions-edit',
  templateUrl: './openpositions-edit.component.html',
  styleUrls: ['./openpositions-edit.component.css']
})
export class OpenpositionsEditComponent implements OnInit {
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;
  account: String = "";

  openPositionForm: FormGroup;
  submitted = false;
  formReset = false;
  JRSS:any = []
  JRSSFull:any = [];

  LineOfBusiness:any = [];
  CompetencyLevel:any = [];
  PositionLocation:any = [];
  RateCardJobRole:any = [];
  Account:any = [];
  AccountArray:any = [];
  loginAdminAccounts:any = [];
  positionID: String = "";
  sequenceID: String = "";


  constructor(
      public fb: FormBuilder,
      private router: Router,
      private actRoute: ActivatedRoute,
      private ngZone: NgZone,
      private apiService: ApiService,
      private openPositionService: OpenPositionService) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.loginAdminAccounts = this.account.split(",");
      }
      this.readCompetencyLevel();
      this.readPositionLocation();
      this.readRateCardJobRole();
      this.readLineOfBusiness();
      this.readAccount();

  }

  ngOnInit(): void {
    let openPositionID = this.actRoute.snapshot.paramMap.get('id');
    this.readOpenPosition(openPositionID);
    this.mainForm();
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
        if (loginAdminAccount === 'SECTOR') {
           this.AccountArray.push(accValue.account);
        }
      }
    }
    })
  }

  // Choose account with select dropdown
  updateAccountProfile(e){
    this.openPositionForm.get('account').setValue(e.value, {
    onlySelf: true
    })
    this.JRSS.length=0;
    this.JRSSFull.length=0;
    this.apiService.getJrsssByAccount(e.value).subscribe((data) => {
        this.JRSSFull = data;
        for(var i=0; i<this.JRSSFull.length; i++) {
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
    });
    this.openPositionForm.get('JRSS').setValue('');
  }


  readOpenPosition(openPositionID) {
      this.openPositionService.readOpenPosition(openPositionID).subscribe(data => {
          this.openPositionForm.setValue({
            positionName: data['positionName'],
            account: data['account'],
            JRSS: data['JRSS'],
            rateCardJobRole: data['rateCardJobRole'],
            lineOfBusiness: data['lineOfBusiness'],
            positionLocation: data['positionLocation'],
            competencyLevel : data['competencyLevel']
          });
          this.positionID = data['positionID'];
          this.sequenceID = data['sequenceID'];
          this.JRSS.length=0;
          this.JRSSFull.length=0;
          this.apiService.getJrsssByAccount(data['account']).subscribe((data) => {
              this.JRSSFull = data;
              for(var i=0; i<this.JRSSFull.length; i++) {
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
          });
    });
  }

   mainForm() {
      this.openPositionForm = this.fb.group({
        positionName: ['', [Validators.required]],
        account: ['', [Validators.required]],
        JRSS: ['', [Validators.required]],
        rateCardJobRole:['', [Validators.required]],
        lineOfBusiness: ['', [Validators.required]],
        positionLocation: ['', [Validators.required]],
        competencyLevel: ['', [Validators.required]]
      })
   }

   // Get all CompetencyLevel
   readCompetencyLevel(){
      this.openPositionService.getCompetencyLevels().subscribe((data) => {
          this.CompetencyLevel = data;
      })
   }

    // Get all PositionLocation
    readPositionLocation(){
       this.openPositionService.getPositionLocations().subscribe((data) => {
          this.PositionLocation = data;
       })
    }

    // Get all RateCardJobRole
     readRateCardJobRole(){
        this.openPositionService.getRateCardJobRoles().subscribe((data) => {
          this.RateCardJobRole = data;
        })
     }

    // Get all LineOfBusiness
    readLineOfBusiness(){
       this.openPositionService.getLineOfBusiness().subscribe((data) => {
        this.LineOfBusiness = data;
       })
    }

   // Choose Job Role with select dropdown
   updateJobRoleProfile(e){
     this.openPositionForm.get('JRSS').setValue(e.value, {
       onlySelf: true
     })
   }

    // Choose Rate Card Job Role with select dropdown
    updateRateCardJobRoleProfile(e){
      this.openPositionForm.get('rateCardJobRole').setValue(e.value, {
        onlySelf: true
      })
    }

     // Choose Line of business with select dropdown
     updateLineOfBusinessProfile(e){
       this.openPositionForm.get('lineOfBusiness').setValue(e.value, {
         onlySelf: true
       })
     }

    // Choose Position Location with select dropdown
    updatePositionLocationProfile(e){
      this.openPositionForm.get('positionLocation').setValue(e.value, {
        onlySelf: true
      })
    }

    // Choose Competency Level with select dropdown
    updateCompetencyLevelProfile(e){
      this.openPositionForm.get('competencyLevel').setValue(e.value, {
        onlySelf: true
      })
    }

    // Getter to access form control
    get myForm(){
      return this.openPositionForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        this.formReset = false;
        if (!this.openPositionForm.valid) {
              return false;
        } else {
        let openPositionID = this.actRoute.snapshot.paramMap.get('id');
        let openPositionDetails = new OpenPosition(
        this.openPositionForm.value.positionName,
        this.positionID,
        this.sequenceID,
        this.openPositionForm.value.JRSS,
        this.openPositionForm.value.rateCardJobRole,
        this.openPositionForm.value.lineOfBusiness,
        this.openPositionForm.value.positionLocation,
        this.openPositionForm.value.competencyLevel,
        this.openPositionForm.value.account,
        "Open",
        this.userName,
        new Date(),
        this.userName,
        new Date()
        );
        this.openPositionService.updateOpenPosition(openPositionID,openPositionDetails).subscribe(
              (res) => {
                console.log('Open Position successfully updated!');
                this.ngZone.run(() => this.router.navigateByUrl('/openpositions-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
              }, (error) => {
                console.log(error);
              });
        }
    }

     //Reset
     resetForm(){
      this.formReset = true;
      this.openPositionForm.reset();
     }

     //Cancel
     cancelForm(){
       this.ngZone.run(() => this.router.navigateByUrl('/openpositions-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
     }

}
