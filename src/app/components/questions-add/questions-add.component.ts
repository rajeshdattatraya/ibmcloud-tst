import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Question } from 'src/app/model/Questions';
import { ResourceLoader } from '@angular/compiler';


@Component({
  selector: 'app-questions-add',
  templateUrl: './questions-add.component.html',
  styleUrls: ['./questions-add.component.css']
})
export class QuestionsAddComponent implements OnInit {
  submitted = false;
  questionForm: FormGroup;
  userName: String = "admin";
  Skills:any = ['Java','Microservices','NodeJS','Angular','MongoDB'];
  Complexities:any = ['Complex', 'Medium', 'Simple'];
  QuestionTypes:any = ['SingleSelect','MultiSelect'];
  answerArray:Array<String>=[];
  optionsArray:Array<Object>=[];
  constructor(public fb: FormBuilder,
                  private router: Router,
                  private ngZone: NgZone,
                  private apiService: ApiService) { this.mainForm();}

  ngOnInit() { }

  mainForm() {
      this.questionForm = this.fb.group({
        complexity: ['', [Validators.required]],
        skill: ['', [Validators.required]],
        questionType: ['', [Validators.required]],
        question: ['', [Validators.required]],
        option1: ['', [Validators.required]],
        option2: ['', [Validators.required]],
        option3: ['', [Validators.required]],
        option4: ['', [Validators.required]],
        option1checkbox:[],
        option2checkbox:[],
        option3checkbox:[],
        option4checkbox:[],
        answerID:[]
      })
    }

    // Getter to access form control
      get myForm(){
        return this.questionForm.controls;
      }
  // Choose skill with select dropdown
    updateSkills(e){
      this.questionForm.get('skill').setValue(e, {
      onlySelf: true
      })
    }

    // Choose QuestionType with select dropdown
    updateQuestionTypes(e){
      this.questionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
    }

    // Choose complexity with select dropdown
    updateComplexity(e){
      this.questionForm.get('complexity').setValue(e, {
      onlySelf: true
      })
    }

    onSubmit() {
        this.submitted = true;
        if (!this.questionForm.valid) {
          console.log('error part');
          return false;
        } else {      
          if(this.questionForm.value.option1checkbox){
            this.answerArray.push("1");}
          if(this.questionForm.value.option2checkbox){
            this.answerArray.push("2");}
            if(this.questionForm.value.option3checkbox){
              this.answerArray.push("3");}
              if(this.questionForm.value.option4checkbox){
                this.answerArray.push("4");}                
                this.questionForm.value.answerID=this.answerArray.toString();
               this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                {optionID:2,option:this.questionForm.value.option2},
                {optionID:3,option:this.questionForm.value.option3},
                {optionID:4,option:this.questionForm.value.option4});         
              this.questionForm.value.options=this.optionsArray;
                //Validation for singleSelect
                if((this.questionForm.value.questionType=="SingleSelect")&& (this.answerArray.toString().length)>1)
                {console.log("only one"+this.questionForm.value.answerID)
                alert("Only one option can be selected as the questionType is SingleSelect")
                return false;
              }

          this.apiService.createQuestion(this.questionForm.value).subscribe(
            (res) => {
              console.log('Question successfully created!');
              this.ngZone.run(() => this.router.navigateByUrl('/manage-questionbank'))
              window.location.reload();
            }, (error) => {
              console.log(error);
            }); 
        }
      }

}
