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
 accounts;
  isRowSelected: boolean;
  dataSource = new MatTableDataSource<Question>();
  accountArr:any = [];

  accountFilter: string;
  filterObj = {};

  displayedColumns: string[]  = ['Action','Question','Account', 'TechStream'];
  optionArray: any[];
  questionObj: any[];
  questionObjectArray: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  accountObj: any;

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
        case 'Question': return item[1];
        case 'Account': return item[2];
        case 'TechStream': return item[3];
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
      this.accountArr = this.account.split(",");
      console.log("Account output" +this.accountArr);
      for(var accountValue of this.accountArr){
      this.apiService.viewQuizQuestions(this.userName, accountValue).subscribe((data) => {
      this.Questions = data;
     
      for (var question of this.Questions){
        
        this.questionObj = [question._id, question.question, question.account, question.technologyStream];
        this.questionObjectArray.push(this.questionObj);
        }
         this.dataSource.data=this.questionObjectArray as Question[];
      
       })
      }

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
  if(window.confirm('Are you sure to delete a question which applies to '+ this.accounts +'?')) {
      this.apiService.deleteQuestion(this.questionID).subscribe((data) => {
        //this.Questions.splice(this.index, 1);
        this.isRowSelected = false;
      this.readQuestion();
     });
    }
  }

}


    onSelectionChange(questionsID,accounts,i){
      this.questionID=questionsID;
      this.accounts=accounts;
      this.index=i;
      this.isRowSelected = true;
    }

    clearFilters() {
      this.dataSource.filter = '';
      this.accountFilter = '';

   }

   applyFilter(filterValue: string,key: string) {
    this.filterObj = {
          value: filterValue.trim().toLowerCase(),
          key: key
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
