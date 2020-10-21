import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormArray,FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {

  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  viewquestionForm: FormGroup;
  uploadFile: String = "Please select a file";
  userName: String = "admin";
  account:any;
  accessLevel:any;
  JRSS:any = [];
  technologyStream:any = [];
  QuestionTypes:any = ['SingleSelect','MultiSelect'];
  ComplexityLevel:any = ['Complex','Medium','Simple'];
  answerArray:Array<String>=[];
  optionsArray:Array<Object>=[];
  questionID:any;
  file: File;
  arrayBuffer: any;
  filelist: any;
  options: Array<String>=[];
  question_id: string;
  accounts:any = [];
  AccountsArr:any = [];
  loginAccounts:any = [];
  Account :any= [];
  AccountArray:any = [];
​
  constructor(public fb: FormBuilder,private actRoute: ActivatedRoute,private router: Router,private ngZone: NgZone,private apiService: ApiService) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.loginAccounts = this.account.split(",");
      }
      this.readTechStream();
      this.mainForm();
      this.readAccount();
  }
​
  ngOnInit() {
    this.question_id = this.actRoute.snapshot.paramMap.get('id');
    this.apiService.getQuestion(this.question_id).subscribe( res => {
    console.log("Account ngOnInit = " + res['account']);
    for (var i of res['options']){
          this.options.push(i.option);
    }
  
    this.AccountsArr = res['account'].split(",");
    console.log("Account from response = " + this.AccountsArr);
​
    this.viewquestionForm.setValue({        
        technologyStream: res['technologyStream'],
        questionType: res['questionType'],
        complexityLevel: res['complexityLevel'],
        question: res['question'],
        option1: this.options[0],
        option2: this.options[1],
        option3: this.options[2],
        option4: this.options[3],
        option1checkbox: (res['answerID'] as string).includes('1') ? true :false,
        option2checkbox:(res['answerID'] as string).includes('2') ? true :false,
        option3checkbox:(res['answerID'] as string).includes('3') ? true :false,
        option4checkbox:(res['answerID'] as string).includes('4') ? true :false,
        answerID:[],
        questionID:res['questionID'],
        account:this.AccountsArr,
        status:res['status']
      });
      
      if(!isNaN(res.questionID)){
        this.questionID=res.questionID;}
      else  {
        this.questionID=0;
      }
    }, (error) => {
      console.log(error);
    });
  }
​
  mainForm() {
      this.viewquestionForm = this.fb.group({
        technologyStream: ['', [Validators.required]],
        questionType: ['', [Validators.required]],
        complexityLevel: ['', [Validators.required]],
        question: ['', [Validators.required]],
        option1: ['', [Validators.required]],
        option2: ['', [Validators.required]],
        option3: [],
        option4: [],
        option1checkbox:[],
        option2checkbox:[],
        option3checkbox:[],
        option4checkbox:[],
        answerID:[],
        questionID:[],
        account:[],
        status:[]
      })
    }
​
  // Getter to access form control
  get myForm(){
        return this.viewquestionForm.controls;
  }
  // Choose JRSS with select dropdown
  updateJRSS(e){
    this.viewquestionForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
  }
​
  // Choose Technology Stream with select dropdown
  updateTechnologyStream(e){
    this.viewquestionForm.get('TechnologyStream').setValue(e, {
        onlySelf: true
    })
  }
      
  updateAccount(e){
    this.viewquestionForm.get('account').setValue(e, {
      onlySelf: true
    })     
  }
​
  // Get all Acconts
  readAccount(){
    let smeAccount:any = [];
    this.loginAccounts = [];
    if(this.account.toLowerCase().trim() !== 'sector') {
      this.loginAccounts = this.account.split(","); 
      console.log("Account value" +this.loginAccounts);  
    } else {
      this.apiService.getAccounts().subscribe((data) => {
      smeAccount = data;     
      for (var account of smeAccount){             
        this.loginAccounts.push(account.account);
        console.log("Account value" +this.loginAccounts);
      }​
    })
  } // end of else
}
  // Get all Technology streams of all JRSS
  readTechStream(){
       this.apiService.getTechStream().subscribe((data) => {
           this.technologyStream = data;
       });      
  }
​
  // Choose QuestionType with select dropdown
  updateQuestionTypes(e){
      this.viewquestionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
  }
​
  // Choose QuestionType with select dropdown
    updateComplexityLevel(e){
      this.viewquestionForm.get('complexityLevel').setValue(e, {
      onlySelf: true
      })
    }
​
  getTechnologyStream() {
      return this.technologyStream;
  }
​
  cancelForm(){
      this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
  }
​
​
  
}
