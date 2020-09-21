import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-questions-add-sectorsme',
  templateUrl: './questions-add-sectorsme.component.html',
  styleUrls: ['./questions-add-sectorsme.component.css']
})
export class QuestionsAddSectorsmeComponent implements OnInit {

  accessLevel: String = "";
  account: String = ""; 
  accountArray:any= [];
  public browserRefresh: boolean;
  Account:any = [];

  submitted = false;
  formReset = false;
  questionForm: FormGroup;
  uploadFile: String = "Please select a file";
  userName: String = "";
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

  constructor(public fb: FormBuilder,
                  private router: Router,
                  private ngZone: NgZone,
                  private apiService: ApiService) { 
                    this.readTechStream();this.mainForm();
                    this.readAccount();
                    this.browserRefresh = browserRefresh;
                    
                  if (!this.browserRefresh){
                      this.userName = this.router.getCurrentNavigation().extras.state.username;
                      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
                      this.account = this.router.getCurrentNavigation().extras.state.account;
                    }
                  }

  ngOnInit() {this.apiService.getQuestionID().subscribe(
    (res) => {  
      if(!isNaN(res.questionID))    {            
      this.questionID=res.questionID;}
      else{
        this.questionID=0;
      }
    }, (error) => {
      console.log(error);
    });       }

  mainForm() {
      this.questionForm = this.fb.group({
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
        account: ['', [Validators.required]]       
      })
    }

    // Getter to access form control
      get myForm(){
        return this.questionForm.controls;
      }

   // Choose JRSS with select dropdown
    updateJRSS(e){
      this.questionForm.get('JRSS').setValue(e, {
      onlySelf: true
      })
    } 

  // Choose Technology Stream with select dropdown
      updateTechnologyStream(e){
        this.questionForm.get('technologyStream').setValue(e, {
        onlySelf: true
        })
      }

  // Get all Acconts
  readAccount(){
    this.apiService.getAccounts().subscribe((data) => {
    this.Account = data;
    })
  }

  // Get all Technology streams of all JRSS
  readTechStream(){
       this.apiService.getTechStream().subscribe((data) => {
           this.technologyStream = data;
       });       
  }
  
  // Choose QuestionType with select dropdown
  updateQuestionTypes(e){
      this.questionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
  }

  // Choose QuestionType with select dropdown
  updateComplexityLevel(e){
      this.questionForm.get('complexityLevel').setValue(e, {
      onlySelf: true
      })
  }

  getTechnologyStream() {
      return this.technologyStream;
    }

  onSubmit() {
      // selected account in comma separated form
      this.accountArray = [];
      for (var account of this.questionForm.value.account)  {     
        if(this.accountArray.indexOf(account.account == -1)){
            this.accountArray.push(account.account);  
        }     
      }       

      // Check if SECTOR value exists in the accountArray
      if(this.accountArray.toString().toLowerCase().indexOf("sector") !== -1)
      {         
        this.accountArray = [];
        this.accountArray.push('SECTOR'); 
      }  
      this.questionForm.value.account = this.accountArray.join(',');          

      //Remove the leading comma if any
      // if (this.questionForm.value.account.substr(0,1) == ",") {
      //   this.questionForm.value.account = this.questionForm.value.account.substring(1);
      // }        

      this.submitted = true;
      this.formReset = false;
      if (!this.questionForm.valid) {         
          return false;
      } else {            
          this.answerArray=[];  
          this.optionsArray=[];
          this.questionForm.value.technologyStream=this.questionForm.value.technologyStream
          if(!(this.questionForm.value.option1checkbox || this.questionForm.value.option2checkbox
            || this.questionForm.value.option3checkbox || this.questionForm.value.option4checkbox)){
              alert("Answers not selected");
            } else if(!(this.questionForm.value.option4 || this.questionForm.value.option3)
            &&(this.questionForm.value.option4checkbox || this.questionForm.value.option3checkbox)){
              alert("You can't select answers where options are empty   ");
            }else if(!(this.questionForm.value.option4)
            &&(this.questionForm.value.option4checkbox)){             
              alert("You can't select answers where options are empty   ");
            }else if(!(this.questionForm.value.option3) && (this.questionForm.value.option4)){
              alert("You can't fill option4 leaving option3 empty");
            }else{  
          if(this.questionForm.value.option1checkbox){
            this.answerArray.push("1");}
          if(this.questionForm.value.option2checkbox){
            this.answerArray.push("2");}
            if(this.questionForm.value.option3checkbox){
              this.answerArray.push("3");}
              if(this.questionForm.value.option4checkbox){
                this.answerArray.push("4");}                
                this.questionForm.value.answerID=this.answerArray.toString();
                if(!(this.questionForm.value.option4) && !(this.questionForm.value.option3)){
                  this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                    {optionID:2,option:this.questionForm.value.option2});      
                }
             else if(!this.questionForm.value.option4){
                  this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                    {optionID:2,option:this.questionForm.value.option2},
                    {optionID:3,option:this.questionForm.value.option3});      
                }
               else{this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                {optionID:2,option:this.questionForm.value.option2},
                {optionID:3,option:this.questionForm.value.option3},
                {optionID:4,option:this.questionForm.value.option4}); 
               }        
              this.questionForm.value.options=this.optionsArray;

              //Validation for singleSelect
              if((this.questionForm.value.questionType=="SingleSelect") && (this.answerArray.toString().length)>1)
                {    
                alert("Only one option can be selected as the questionType is SingleSelect");                
                return false;
              }       
              this.questionID++;                
              this.questionForm.value.questionID=this.questionID;
              
          this.apiService.createQuestion(this.questionForm.value).subscribe(
            (res) => {
              console.log('Question successfully created!');
              window.confirm('Succesfully added to QuestionBank');
              this.formReset = true;
              this.questionForm.reset();
              this.ngZone.run(() => this.router.navigateByUrl('/manage-questionbank-sectorsme',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
            }, (error) => {
              console.log(error);
            }); 
          }
        }
      }

    updateAccount(event) {
        this.questionForm.value.account = event.source.value;
    }

    cancelForm(){
      this.ngZone.run(() => this.router.navigateByUrl('/view-questionbank',{state:{username:this.userName,account:this.account}}));
    }

    resetForm() {
      this.formReset = true;
      this.questionForm.reset();
    }
}
