import { Component, OnInit , NgZone, ViewChild} from '@angular/core';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      this.questionObjectArray = [];
      this.Questions =[];
      this.apiService.viewQuizQuestions(this.userName,this.account).subscribe((data) => {
      this.Questions = data;
      for (var question of this.Questions){
        this.optionArray = [];

        for (var option of question.options){
          this.optionArray.push(option.option);
        }
        this.questionObj = [question._id, question.question, this.optionArray];
        this.questionObjectArray.push(this.questionObj);
        }
         this.dataSource.data=this.questionObjectArray as Question[];
       })
  }

invokeEdit(){

  if (this.isRowSelected == false){
    alert("Please select the Question");
    }else{
    this.isRowSelected = false;
    this.router.navigate(['/question-edit/',this.questionID], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
    }

}

removeQuestion(){
  if(this.isRowSelected == false){
    alert("Please select the Question");
  }else{
  if(window.confirm('Are you sure?')) {
      this.apiService.deleteQuestion(this.questionID).subscribe((data) => {
        //this.Questions.splice(this.index, 1);
        this.isRowSelected = false;
      this.readQuestion();
     });
    }
  }

}


    onSelectionChange(questionsID,i){
      this.questionID=questionsID;
      this.index=i;
      this.isRowSelected = true;
    }





}
