import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormArray,FormBuilder, Validators } from "@angular/forms";
import { Question } from 'src/app/model/questions';
import { ResourceLoader } from '@angular/compiler';
import { browserRefresh } from '../../app.component';
import * as XLSX from 'xlsx';


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
  constructor(public fb: FormBuilder,private actRoute: ActivatedRoute,private router: Router,private ngZone: NgZone,private apiService: ApiService) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.loginAccounts = this.account.split(",");
         // console.log("Accounts" +this.accounts);
      }
      this.readTechStream();
      this.mainForm();
      this.readAccount();
  }

  ngOnInit() {
     this.question_id = this.actRoute.snapshot.paramMap.get('id');

    this.apiService.getQuestion(this.question_id).subscribe( res => {
//      for(var key in res)
  // {
    //  console.log("key: " + key + ", value: " + res[key])
  // }
      console.log("Account" +res['account']);
   for (var i of res['options']){
          this.options.push(i.option);
  }
  
  this.AccountsArr = res['account'].split(",");
  console.log("Account from response" +this.AccountsArr.length);
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
      });
      if(!isNaN(res.questionID))    {
      this.questionID=res.questionID;}
      else{
        this.questionID=0;
      }
    }, (error) => {
      console.log(error);
    });
  }

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


      })
    }

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



  // Choose Technology Stream with select dropdown
      updateTechnologyStream(e){
        this.editquestionForm.get('TechnologyStream').setValue(e, {
        onlySelf: true
        })
      }

      // Get all Acconts
      // Choose account with select dropdown
    //  if(this.account !== 'SECTOR'){
      updateAccount(e){
        this.editquestionForm.get('account').setValue(e, {
          onlySelf: true
          })     
    }

    // Get all Acconts
    readAccount(){
      let smeAccount:any = [];
      if(this.account !== 'SECTOR'){
      this.loginAccounts = this.account.split(",");
    }
  
      else{
    this.apiService.getAccounts().subscribe((data) => {
   // smeAccount = data;
    this.loginAccounts = data['account'];
    console.log("LoginAccounts inside else" +this.loginAccounts);
    })
  }
}
    // Get all Technology streams of all JRSS
    readTechStream(){
       this.apiService.getTechStream().subscribe((data) => {
           this.technologyStream = data;
       });
       console.log("Master technologyStream: "+ JSON.stringify(this.technologyStream));
     }

    // Choose QuestionType with select dropdown
    updateQuestionTypes(e){
      this.editquestionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
    }
    // Choose QuestionType with select dropdown
    updateComplexityLevel(e){
      this.editquestionForm.get('complexityLevel').setValue(e, {
      onlySelf: true
      })
    }
    getTechnologyStream() {
      return this.technologyStream;
    }

    cancelForm(){
      this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
    }


    onSubmit() {
          // selected account in comma separated form
      this.AccountArray = [];
      for (var account of this.editquestionForm.value.account)  {     
        if(this.AccountArray.indexOf(account.account == -1)){
            this.AccountArray.push(account.account);  
        }     
      }       

      // Check if SECTOR value exists in the accountArray
      if(this.AccountArray.toString().toLowerCase().indexOf("sector") !== -1)
      {         
        this.AccountArray = [];
        this.AccountArray.push('SECTOR'); 
      }  
      this.editquestionForm.value.account = this.AccountArray.join(',');   

        this.submitted = true;
        this.formReset = false;
        if (!this.editquestionForm.valid) {
          //console.log('error part');
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
                {//console.log("only one"+this.editquestionForm.value.answerID)
                alert("Only one option can be selected as the questionType is SingleSelect");
                return false;
              }
              this.questionID++;
              this.editquestionForm.value.questionID=this.questionID;
              this.editquestionForm.value.account=this.account;

         /*  this.apiService.updateQuestion(this.question_id,this.editquestionForm.value).subscribe(
            (res) => {
              console.log('Question successfully updated!');
             // window.confirm('Succesfully added to QuestionBank');
             if(confirm('Do you want to update the Question?')){
               this.formReset = true;
               this.editquestionForm.reset();
             }else{
               return false;
             }

              //this.ngZone.run(() => this.router.navigateByUrl('/manage-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
            }, (error) => {
              console.log(error);
            }); */

            if(confirm('Do you want to update the Question which applies to '+ this.editquestionForm.value.account +' accounts?')){
              this.apiService.updateQuestion(this.question_id,this.editquestionForm.value).subscribe(
                (res) => {
                  //console.log('Question successfully updated!');
                  this.formReset = true;
                  this.editquestionForm.reset();
                  this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
                  //this.ngZone.run(() => this.router.navigateByUrl('/edit-question/5f35440c307bc06254cd782f',{state:{username:this.userName,account:this.account}}))
                 //this.ngZone.run(() => this.router.navigateByUrl('/login-component',{state:{username:this.userName,account:this.account}}))

                },(error) => {
                  console.log(error);
                });
            }else{
              return false;
            }

          }
        }
      }
}
