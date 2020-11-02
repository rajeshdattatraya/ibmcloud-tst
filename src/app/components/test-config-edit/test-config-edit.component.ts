import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TestConfigService } from './../../service/testconfig.service';
import { ApiService } from './../../service/api.service';
import { TestConfig } from './../../model/testConfig';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-test-config-edit',
  templateUrl: './test-config-edit.component.html',
  styleUrls: ['./test-config-edit.component.css']
})
export class TestConfigEditComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  config: any;
  testConfigEditForm: FormGroup;
  JRSS:any = [];
  testDuration: number;
  noOfQuestions: number;
  passingScore:number;
  TestConfigs:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  oldJRSS: String = "";
  testConfigID: String = "";
  accounts:any=[];
  filteredJrss:any = [];
  oldId: String = "";

  dataSource = new MatTableDataSource<TestConfig>();
  displayedColumns = ['Action','JRSS', 'noOfQuestions','testDuration','passingScore'];
  displayedColumnsWithAccount = ['Action','JRSS', 'account', 'noOfQuestions','testDuration','passingScore'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
      public fb: FormBuilder,
      private router: Router,
      private actRoute: ActivatedRoute,
      private ngZone: NgZone,
      private testconfigService: TestConfigService,
      private apiService: ApiService
    ) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.accounts = this.account.split(",");
          
          
      }
      let id = this.actRoute.snapshot.paramMap.get('id');
      this.getTestConfig(id);
      this.getAllTestConfigs();
      this.updateTestConfig();
    }

    ngOnInit() {
      this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
          if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
             this.router.navigate(['/login-component']);
          }
      }
      this.testConfigEditForm = this.fb.group({
            JRSS: ['', [Validators.required]],
            account: ['', [Validators.required]],
            noOfQuestions: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            testDuration: ['', [Validators. required, Validators.pattern('^[0-9]+$')]],
            passingScore: ['', [Validators. required, Validators.pattern('^[0-9]+$')]]
      })
    }

    ngAfterViewInit (){
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

     // Get all Jrss
     getAllJRSS(){
      this.apiService.getJRSS().subscribe((data) => {
      this.JRSS = data;

      for (let k=0; k<this.JRSS.length; k++){
        var item = this.JRSS[k].account;
         let accountExists =  false;
         for (var i = 0; i < this.accounts.length; i++) {
          
           if ( item.toLowerCase().indexOf(this.accounts[i].toLowerCase()) == -1) {
             accountExists =  false;
           } else { accountExists =  true; 
             break; }
         }
 
         if (accountExists == true) {
           this.filteredJrss.push(this.JRSS[k]);
         }
       }
      
      })
    }

    onSelectionChange(testConfigId) {
      this.testConfigID = testConfigId;
    }

    editTestConfig() {
      if (this.testConfigID == "") {
        alert("Please select the test configuration record")
      } else {
        this.router.navigate(['/testconfig-edit/', this.testConfigID], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
      }
    }

    // Choose designation with select dropdown
    updateJrssProfile(e){
      this.testConfigEditForm.get('JRSS').setValue(e, {
        onlySelf: true
      })
    }

    getTestConfig(id) {
        this.testconfigService.getTestConfig(id).subscribe(data => {          
          this.testConfigEditForm.setValue({
            JRSS: data['JRSS'],
            account: data['account'],
            noOfQuestions: data['noOfQuestions'],
            testDuration: data['testDuration'],
            passingScore:data['passingScore']
          });
          this.oldJRSS = data['JRSS'];
         this.apiService.getJrsssByAccount(data['account']).subscribe((data) => {
                this.filteredJrss = data;
         });
        });
    }

      updateTestConfig() {
        this.testConfigEditForm = this.fb.group({
          JRSS: ['', [Validators.required, Validators.pattern('^[0-9A-Z]+$')]],
          account: ['', [Validators.required, Validators.pattern('^[0-9A-Z]+$')]],
          noOfQuestions: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          testDuration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          passingScore: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
        })
      }

    //get All Test Configs
    getAllTestConfigs(){
        this.testconfigService.getAllTestConfigs().subscribe((data) => {
        this.TestConfigs = data;

       var filteredTestConfig:any=[];
        for (let k=0; k<this.TestConfigs.length; k++){
          var item = this.TestConfigs[k].account;
           let accountExists =  false;
           for (var i = 0; i < this.accounts.length; i++) {
            
             if ( item.toLowerCase().indexOf(this.accounts[i].toLowerCase()) == -1) {
               accountExists =  false;
             } else { accountExists =  true; 
               break; }
           }
   
           if (accountExists == true) {
             filteredTestConfig.push(this.TestConfigs[k]);
           }
         }
         this.dataSource.data = filteredTestConfig as TestConfig[];
        })
    }

    // Getter to access form control
    get myForm(){
      return this.testConfigEditForm.controls;
    }

    //Cancel
    cancelForm(){
      this.ngZone.run(() => this.router.navigateByUrl('/testconfig-add', {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
    }

    onSubmit() {
        this.submitted = true;
        if (!this.testConfigEditForm.valid) {
          return false;
        } else {
            if (this.testConfigEditForm.value.testDuration < 10) {
              window.alert("Test duration should be minimum of 10 mins");
            } else {
              let testConfig = new TestConfig(this.testConfigEditForm.value.JRSS,this.testConfigEditForm.value.account,
              this.testConfigEditForm.value.noOfQuestions, this.testConfigEditForm.value.testDuration,this.testConfigEditForm.value.passingScore);
              let id = this.actRoute.snapshot.paramMap.get('id');
              this.testconfigService.findTestConfigByJRSS(this.testConfigEditForm.value.JRSS,this.testConfigEditForm.value.account).subscribe(
                (res) => {
              this.oldId = res['_id'];
              if (!(this.oldId.toString() === id.toString())) {
                window.alert("There is already record exists for the combination of this job role and account.");
                return false;
              } else {
                this.testconfigService.updateTestConfig(id, testConfig)
                  .subscribe(res => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['/testconfig-add'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                    console.log('Content updated successfully!')
                  }, (error) => {
                    console.log(error)
                })
              }
              }, (error) => {
                   this.testconfigService.updateTestConfig(id,testConfig).subscribe(
                     (res) => {
                      console.log('Content updated successfully!')
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                      this.router.navigate(['/testconfig-add'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                     }, (error) => {
                       console.log(error);
                  });
               });
              }
        }
    }


    //Read JRSS by account    
  readJrssByAccount(accountValue){
    if ( accountValue.trim() !== "") {

      this.apiService.getJrsssByAccount(accountValue).subscribe((data) => {
        this.filteredJrss = data;
      });  
    } else {
      this.getAllJRSS();
    }
    this.testConfigEditForm.get('JRSS').setValue('');
  }

}
