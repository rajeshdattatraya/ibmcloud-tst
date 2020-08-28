import { Component, OnInit , NgZone} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { appConfig } from '../../model/appConfig';
import { Question } from '../../model/questions';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  public browserRefresh: boolean;

  userName: String = "";
  accessLevel: String = "";
  account:String = "";
  Questions:any = [];
  config: any;
  index;
  questionID;
  isRowSelected: boolean;
  dataSource = new MatTableDataSource<Question>();

  displayedColumns = ['Action','Question','Option'];
  optionArray: any[];
  questionObj: any[];
  questionObjectArray: any = [];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(public fb: FormBuilder,private router: Router, private apiService: ApiService,private route: ActivatedRoute) {
      this.config = {
        currentPage: appConfig.currentPage,
        itemsPerPage: appConfig.itemsPerPage,
        totalItems:appConfig.totalItems
      };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        console.log("Account value" +this.account );
    }

    route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.readQuestion();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'question': return item[1];
        case 'option': return item[2];
        default: return item[property];
      }
   };
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  

//Get all questions
  readQuestion(){
    this.apiService.viewQuizQuestions(this.userName,this.account).subscribe((data) => {
      this.Questions = data;
      for (var question of this.Questions){     
        this.optionArray = [];
        console.log("Options" +question.options);
        for (var option of question.options){          
          this.optionArray.push(option.option); 
          //let split = this.optionArray.join('.</br>');       
        }        
        this.questionObj = [question.question, this.optionArray];
        this.questionObjectArray.push(this.questionObj);  
        this.dataSource.data=this.questionObjectArray as Question[];  
        }  
       })
}

invokeEdit(questionID){

  if (this.isRowSelected == false){
    alert("Please select the user");
    }else{
      console.log("Clicked on the question in view screen"+questionID);
    //this.router.navigate(['/question-edit/', this.candidateId, this.candidateUsersId], {state: {username:this.userName,account:this.account}});
    this.router.navigate(['/question-edit/',questionID], {state: {username:this.userName,account:this.account}});
    }

}

removeQuestion(questionID){
  if(this.isRowSelected == false){
    alert("Please select the Question");
  }else{
  if(window.confirm('Are you sure?')) {
      this.apiService.deleteQuestion(questionID).subscribe((data) => {
      //  this.Candidate.splice(index, 1);
      this.readQuestion();
      });
    }
  }
   this.isRowSelected = false;
}


    onSelectionChange(questionsID,i){
      this.Questions.questionID=questionsID;
      this.index=i;
      this.isRowSelected = true;
    }





}
