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
  qID;
  accounts;
  isRowSelected: boolean = false;
  dataSource = new MatTableDataSource<Question>();
  accountArr:any = [];
  finalArr:any = [];

  accountFilter: string;
  filterObj = {};

  displayedColumns: string[]  = ['Action','Question','Account', 'TechStream'];
  optionArray: any[];
  questionObj: any[];
  questionObjectArray: any = [];
  accountObj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filteredQuestion: any=[];
  smeQuestionObj: any={};
  smeQuestion: any = [];
  isDeletQuestion: boolean;

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

      let JSONObject = {};
      this.questionObjectArray = [];
      this.Questions =[];
      this.accountArr = this.account.split(",");
      let status = "Active";
      this.apiService.getAllQuestions(status).subscribe((data) => {
      this.Questions = data;
      console.log("Questions" +this.Questions.length);
      if(this.account === 'SECTOR') {
         this.filteredQuestion = [];
         for (let k=0; k<this.Questions.length; k++){
          this.smeQuestionObj = [this.Questions[k]._id, this.Questions[k].question, this.Questions[k].account, this.Questions[k].technologyStream];
          this.filteredQuestion.push(this.smeQuestionObj);
        }
      } else {
         this.filteredQuestion = [];
         for (let k=0; k<this.Questions.length; k++){
          var item = this.Questions[k].account;
           let questionExists =  false;
           for (var i = 0; i < this.accountArr.length; i++) {
             if ( item.toLowerCase().indexOf(this.accountArr[i].toLowerCase()) == -1 && item.toLowerCase().indexOf("sector") == -1) {
              // accountExists =  false;
             } else {
               questionExists =  true;
               break;
             }
           }
           if (questionExists == true) {
             this.questionObj = [this.Questions[k]._id, this.Questions[k].question, this.Questions[k].account, this.Questions[k].technologyStream,this.Questions[k].questionID];
             this.filteredQuestion.push(this.questionObj);
           }
         }
      }
          this.dataSource.data=this.filteredQuestion as Question[];
          console.log("datasource length" +this.dataSource.data.length);
    })
  }


invokeEdit(){

  if (this.isRowSelected == false) {
    alert("Please select the Question");
    return false;
  } else {
     this.apiService.findUserAnswer(this.qID).subscribe((res) => {
         if (res.count > 0) {
          alert("You can not edit this question as this is already appeared in online test.");
          return false;
        } else if (res.count > 0 || res.count == 0) {
          this.isRowSelected = false;
          this.router.navigate(['/question-edit/',this.questionID], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
        }
      }, (error) => {
          console.log("Error  - " + error);
      });
    }
  }

removeQuestion(){
  if(this.isRowSelected == false){
    alert("Please select the Question");
    return false;
  } else {
     this.apiService.findUserAnswer(this.qID).subscribe((res) => {
     if (res.count > 0) {
      alert("You can not delete this question as this is already appeared in online test.");
      return false;
     } else if (res.count > 0 || res.count == 0) {
        if(window.confirm('Are you sure?')) {
            this.apiService.deleteQuestion(this.questionID).subscribe((data) => {
              this.Questions.splice(this.index, 1);
            });
              this.readQuestion();
              this.isRowSelected = false;
        }
     }
    }, (error) => {
        console.log("Error found while updating userLoggedin column of Users table - " + error);
  });
  }
}

    onSelectionChange(questionsID,accounts,i,qID){
      this.questionID=questionsID;
      this.accounts=accounts;
      this.qID = qID;
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
