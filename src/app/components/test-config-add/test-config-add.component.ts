import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TestConfigService } from './../../service/testconfig.service';
import { ApiService } from './../../service/api.service';
import { TestConfig } from './../../model/testConfig';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';

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
  testConfigID: String = "";

  constructor(
      public fb: FormBuilder,
      private router: Router,
      private actRoute: ActivatedRoute,
      private ngZone: NgZone,
      private testconfigService: TestConfigService,
      private apiService: ApiService
    ) {
    this.config = {
            currentPage: appConfig.currentPage,
            itemsPerPage: appConfig.itemsPerPage,
            totalItems: appConfig.totalItems
          };
      actRoute.queryParams.subscribe(
            params => this.config.currentPage= params['page']?params['page']:1 );
      this.browserRefresh = browserRefresh;
      this.mainForm();
      this.readJrss();
      this.getAllTestConfigs();
    }

    ngOnInit() {
      this.browserRefresh = browserRefresh;
    }

    mainForm() {
        this.testConfigAddForm = this.fb.group({
          JRSS: ['', [Validators.required]],
          noOfQuestions: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          testDuration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
          passingScore: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
        })
      }

     // Get all Jrss
     readJrss(){
      this.apiService.getJRSS().subscribe((data) => {
      this.JRSS = data;
      })
    }

    // Choose designation with select dropdown
    updateJrssProfile(e){
      this.testConfigAddForm.get('JRSS').setValue(e, {
        onlySelf: true
      })
    }
    pageChange(newPage: number) {
          this.router.navigate(['/testconfig-add'], { queryParams: { page: newPage } });
    }
    onSelectionChange(testConfigId) {
      this.testConfigID = testConfigId;
    }

    editTestConfig() {
      if (this.testConfigID == "") {
        alert("Please select the test configuration record");
      } else {
        this.router.navigate(['/testconfig-edit/', this.testConfigID]);
      }
    }

    //get All Test Configs
    getAllTestConfigs(){
      this.testconfigService.getAllTestConfigs().subscribe((data) => {
       this.TestConfigs = data;
      })
    }


    // Getter to access form control
    get myForm(){
      return this.testConfigAddForm.controls;
    }


    onSubmit() {
        this.submitted = true;        
        if (!this.testConfigAddForm.valid) {          
          return false;
        } else {
          if (this.testConfigAddForm.value.passingScore < 50) {
            window.alert("Please enter passing score above 50");
          } else {
            let jrss = this.testConfigAddForm.value.JRSS;
           let testConfig = new TestConfig(this.testConfigAddForm.value.JRSS,
           this.testConfigAddForm.value.noOfQuestions, this.testConfigAddForm.value.testDuration,this.testConfigAddForm.value.passingScore);

            this.testconfigService.findTestConfigByJRSS(jrss).subscribe(
               (res) => {
                  let jrss = res['JRSS'];
                  let id = res['_id'];
                  this.testconfigService.updateTestConfig(id, testConfig)
                     .subscribe(res => {
                       this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                       this.router.navigate(['/testconfig-add']));
                       console.log('Content updated successfully!')
                     }, (error) => {
                       console.log(error)
                 })
               }, (error) => {
                   this.testconfigService.createTestConfig(testConfig).subscribe(
                     (res) => {
                      console.log('Test Config successfully saved!')
                      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                      this.router.navigate(['/testconfig-add']));
                     }, (error) => {
                       console.log(error);
                  });
               });
          }
          }

    }


}
