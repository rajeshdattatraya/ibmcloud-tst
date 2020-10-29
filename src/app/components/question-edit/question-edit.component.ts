import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormArray,FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
​
@Component({
  selector: 'question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  editquestionForm: FormGroup;
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
  qID:any;
  //isEditQuestion ;
​
  constructor(public fb: FormBuilder,private actRoute: ActivatedRoute,private router: Router,private ngZone: NgZone,private apiService: ApiService) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.loginAccounts = this.account.split(",");
          this.qID = this.router.getCurrentNavigation().extras.state.qID;
          this.questionID = this.router.getCurrentNavigation().extras.state.question;
            }
      this.readTechStream();
      this.mainForm();
      this.readAccount();
  }
​
  ngOnInit() {
    this.question_id = this.actRoute.snapshot.paramMap.get('id');
    console.log("question id: " +this.question_id);
    this.apiService.getQuestion(this.question_id).subscribe( res => {
    console.log("Account ngOnInit = " + res['account']);
    for (var i of res['options']){
          this.options.push(i.option);
    }
  
    this.AccountsArr = res['account'].split(",");
    console.log("Account from response = " + this.AccountsArr);
​    if (this.options[2] == null || this.options[2] == undefined) {
        this.options[2] = '';
    }
    if (this.options[3] == null || this.options[3] == undefined) {
            this.options[3] = '';
    }
    this.editquestionForm.setValue({
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
      this.editquestionForm = this.fb.group({
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
        return this.editquestionForm.controls;
  }
  // Choose JRSS with select dropdown
  updateJRSS(e){
    this.editquestionForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
  }
​
  // Choose Technology Stream with select dropdown
  updateTechnologyStream(e){
    this.editquestionForm.get('TechnologyStream').setValue(e, {
        onlySelf: true
    })
  }
      
  updateAccount(e){
    this.editquestionForm.get('account').setValue(e, {
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
    } else {
      this.apiService.getAccounts().subscribe((data) => {
      smeAccount = data;     
      for (var account of smeAccount){             
        this.loginAccounts.push(account.account);
        console.log("account details:" +this.loginAccounts);
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
      this.editquestionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
  }
​
  // Choose QuestionType with select dropdown
    updateComplexityLevel(e){
      this.editquestionForm.get('complexityLevel').setValue(e, {
      onlySelf: true
      })
    }
​
  getTechnologyStream() {
      return this.technologyStream;
  }
​
  cancelForm(){
    ​this.apiService.findUserAnswer(this.qID).subscribe((res) => {
      if(res.count >0){
        console.log("Cancel edit for Question which had appeared in online assessment");
    this.apiService.editQuestion(this.question_id).subscribe(res =>{
      this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
  }, (error) =>{
    console.log("Error  - " + error);
  });}
  else if (res.count == 0){
    console.log("Cancel edit for Question which had not appeared in online assessment");
    this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
  }
}, (error)=>{
  console.log("Error  - " + error);
}) 
  }
​
​
  onSubmit() {
      // selected account in comma separated form
      this.AccountArray = [];
      for (var account of this.editquestionForm.value.account) {
        if(this.AccountArray.indexOf(account) == -1){
            this.AccountArray.push(account);
        }     
      }       
​
      // Check if SECTOR value exists in the accountArray
      if(this.AccountArray.toString().toLowerCase().indexOf("sector") !== -1) {
        if(this.AccountArray.toString().toLowerCase().includes('sector') &&  this.AccountArray.length > 1){
          window.alert("Please select either sector or account(s) in Account field.");
          return false;
        }        
        this.AccountArray = [];
        this.AccountArray.push('SECTOR'); 
      }
        this.submitted = true;
        this.formReset = false;
        if (!this.editquestionForm.valid) {         
          return false;
        } else {
          this.answerArray=[];
          this.optionsArray=[];
          this.editquestionForm.value.technologyStream=this.editquestionForm.value.technologyStream
          if(!(this.editquestionForm.value.option1checkbox || this.editquestionForm.value.option2checkbox
            || this.editquestionForm.value.option3checkbox || this.editquestionForm.value.option4checkbox)){
              alert("Answers not selected");
            } else if(!(this.editquestionForm.value.option4 || this.editquestionForm.value.option3)
            &&(this.editquestionForm.value.option4checkbox || this.editquestionForm.value.option3checkbox)){
              //console.log('else if only 2 options');
              alert("You can't select answers where options are empty   ");
            }else if(!(this.editquestionForm.value.option4)
            &&(this.editquestionForm.value.option4checkbox)){
              //console.log('else if only 3 options');
              alert("You can't select answers where options are empty   ");
            }else if(!(this.editquestionForm.value.option3) && (this.editquestionForm.value.option4)){
              alert("You can't fill option4 leaving option3 empty");
            }else{
          if(this.editquestionForm.value.option1checkbox){
            this.answerArray.push("1");}
          if(this.editquestionForm.value.option2checkbox){
            this.answerArray.push("2");}
            if(this.editquestionForm.value.option3checkbox){
              this.answerArray.push("3");}
              if(this.editquestionForm.value.option4checkbox){
                this.answerArray.push("4");}
                this.editquestionForm.value.answerID=this.answerArray.toString();
                if(!(this.editquestionForm.value.option4) && !(this.editquestionForm.value.option3)){
                  this.optionsArray.push({optionID:1,option:this.editquestionForm.value.option1},
                    {optionID:2,option:this.editquestionForm.value.option2});
                }
             else if(!this.editquestionForm.value.option4){
                  this.optionsArray.push({optionID:1,option:this.editquestionForm.value.option1},
                    {optionID:2,option:this.editquestionForm.value.option2},
                    {optionID:3,option:this.editquestionForm.value.option3});
                }
               else{this.optionsArray.push({optionID:1,option:this.editquestionForm.value.option1},
                {optionID:2,option:this.editquestionForm.value.option2},
                {optionID:3,option:this.editquestionForm.value.option3},
                {optionID:4,option:this.editquestionForm.value.option4});
               }
              this.editquestionForm.value.options=this.optionsArray;
                //Validation for singleSelect
                if((this.editquestionForm.value.questionType=="SingleSelect")&& (this.answerArray.toString().length)>1)
                {
                alert("Only one option can be selected as the questionType is SingleSelect");
                return false;
              }
              this.questionID++;
              console.log("qID value: " +this.questionID);
              this.editquestionForm.value.questionID=this.questionID;
              this.editquestionForm.value.account=this.AccountArray.join(',');
              this.editquestionForm.value.status="Active";
​this.apiService.findUserAnswer(this.qID).subscribe((res) => {
  if(res.count > 0){
    console.log("Updated Question which had appeared in online assessment");
    {
      this.apiService.getQuestionID().subscribe(
        (res) => {  
          if(!isNaN(res.questionID))    {            
          this.questionID=res.questionID;
        console.log("Max question ID:" +this.questionID);
        }
          else{
            this.questionID=0;
          }
        }, (error) => {
          console.log(error);
        });       }
this.apiService.createQuestion(this.editquestionForm.value).subscribe(
  (res) => {
    //console.log('Question successfully updated!');
   this.formReset = true;
    this.editquestionForm.reset();
    alert("Question updated successfully");
    this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
  },(error) => {
    console.log(error);
  });
  }   
   else if (res.count == 0){
    console.log("Updated Question which had not appeared in online assessment");
                  this.apiService.updateQuestion(this.question_id,this.editquestionForm.value).subscribe(
                    (res) => {
                     this.formReset = true;
                      this.editquestionForm.reset();
                      alert("Question updated successfully");
                      this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                    },(error) => {
                      console.log(error);
                    });

                 } 
                 })
        }
        }
  }
}
