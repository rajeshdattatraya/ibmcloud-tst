import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
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
  selector: 'app-test-config-add',
  templateUrl: './test-config-add.component.html',
  styleUrls: ['./test-config-add.component.css']
})
export class TestConfigAddComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  config: any;
  testConfigAddForm: FormGroup;
  JRSS:any = [];
  testDuration: number;
  noOfQuestions: number;
  passingScore:number;
  TestConfigs:any = [];
  TestConfigDetails:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  testConfigID: String = "";
  formReset = false;
  accounts:any=[];

  filteredJrss:any = [];

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
      this.mainForm();
      this.readJrss();
    }

    ngOnInit() {
      this.browserRefresh = browserRefresh;
      this.getAllTestConfigs();
    }

    ngAfterViewInit (){
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    mainForm() {
        this.testConfigAddForm = this.fb.group({
          JRSS: ['', [Validators.required]],
          account: ['', [Validators.required]],
          noOfQuestions: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          testDuration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          passingScore: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
        })
      }

     // Get all Jrss
     readJrss(){
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



//Read JRSS by account    
  readJrssByAccount(accountValue){
    if ( accountValue.trim() !== "") {

      this.apiService.getJrsssByAccount(accountValue).subscribe((data) => {
        this.filteredJrss = data;
      });  
    } else {
      this.readJrss();
    }
   
  }

    // Choose designation with select dropdown
    updateJrssProfile(e){
      this.testConfigAddForm.get('JRSS').setValue(e, {
        onlySelf: true
      })
    }
    onSelectionChange(testConfigId) {
      this.testConfigID = testConfigId;
    }

    editTestConfig() {
      if (this.testConfigID == "") {
        alert("Please select the test configuration record");
      } else {
        this.router.navigate(['/testconfig-edit/', this.testConfigID], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
      }
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
      return this.testConfigAddForm.controls;
    }


    onSubmit() {
        this.submitted = true;
        this.formReset = false;
        if (!this.testConfigAddForm.valid) {          
          return false;
        } else {          
          if (this.testConfigAddForm.value.testDuration < 10) { 
            window.alert("Test duration should be minimum of 10 mins");
          } else if (this.testConfigAddForm.value.passingScore < 50) {
            window.alert("Please enter passing score 50 or above");
          } else {
            let jrss = this.testConfigAddForm.value.JRSS;
           let testConfig = new TestConfig(this.testConfigAddForm.value.JRSS, this.testConfigAddForm.value.account,
           this.testConfigAddForm.value.noOfQuestions, this.testConfigAddForm.value.testDuration,this.testConfigAddForm.value.passingScore);

            this.testconfigService.findTestConfigByJRSS(jrss,this.testConfigAddForm.value.account).subscribe(
               (res) => {
                  let jrss = res['JRSS'];
                  let id = res['_id'];
                  this.testconfigService.updateTestConfig(id, testConfig)
                     .subscribe(res => {
                       this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                       this.router.navigate(['/testconfig-add'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                       console.log('Content updated successfully!')
                     }, (error) => {
                       console.log(error)
                 })
               }, (error) => {
                   this.testconfigService.createTestConfig(testConfig).subscribe(
                     (res) => {
                      console.log('Test Config successfully saved!')
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                      this.router.navigate(['/testconfig-add'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                     }, (error) => {
                       console.log(error);
                  });
               });
          }
          }

    }

    clearForm() {
      this.formReset = true;
      this.testConfigAddForm.reset();
    }

}
