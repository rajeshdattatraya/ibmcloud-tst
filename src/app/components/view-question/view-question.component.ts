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
      //for(var accountValue of this.accountArr){
      this.apiService.getAllQuestions().subscribe((data) => {
      this.Questions = data;
     console.log("Questions" +this.Questions.length);
     
     for (let k=0; k<this.Questions.length; k++){
      var item = this.Questions[k].account;
       let questionExists =  false;
       for (var i = 0; i < this.accountArr.length; i++) {
        
         if ( item.toLowerCase().indexOf(this.accountArr[i].toLowerCase()) == -1) {
          // accountExists =  false;
         } else { questionExists =  true; 
           break; }
       }

       if (questionExists == true) {
        this.questionObj = [this.Questions[k]._id, this.Questions[k].question, this.Questions[k].account, this.Questions[k].technologyStream];
         this.filteredQuestion.push(this.questionObj);
       }
     }
      this.dataSource.data=this.filteredQuestion as Question[];
  
    })
 // }  
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
