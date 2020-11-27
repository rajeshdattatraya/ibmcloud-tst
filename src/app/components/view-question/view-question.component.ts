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
  searchFilter() {
    throw new Error('Method not implemented.');
  }
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
  questionFilter:string;
  techStreamFilter: string;
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
  getQuestionDetails: any= [];
  mode: string;
  displayAnswer = false;
  isEditQuestion = 'N';
  loginAccounts:any = [];
  

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
        this.loginAccounts = this.account.split(",");
    }
    route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.readQuestion();
      this.readAccount();
  }


  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.dataSource.filterPredicate = (data, filter) => {
      if (this.filterObj['key'] == 'Question'){
        data[this.filterObj['key']] = data[1];
      } else if (this.filterObj['key'] == 'Account'){
        data[this.filterObj['key']] = data[2];
      } else if (this.filterObj['key'] == 'TechStream'){
        data[this.filterObj['key']] = data[3];
      }
     if(data[this.filterObj['key']] && this.filterObj['key']) {
          if (data[this.filterObj['key']].toLowerCase().startsWith(this.filterObj['value'])) {
             return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
          }
      }
      return false;
    }
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'Question': return item[1];
        case 'Account': return item[2];
        case 'TechStream': return item[3];
        default: return item[property];
      }
   };
   
  }

  //public selectedBrand;
  //public accountValue(e) {
    //  this.accounts = this.loginAccounts.filter(item => item.name === this.accountFilter);
  //}
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
          this.smeQuestionObj = [this.Questions[k]._id, this.Questions[k].question, this.Questions[k].account, this.Questions[k].technologyStream,this.Questions[k].questionID];
          this.filteredQuestion.push(this.smeQuestionObj);
        }
      } else {
         this.filteredQuestion = [];
         for (let k=0; k<this.Questions.length; k++){
          var item = this.Questions[k].account;
           let questionExists =  false;
           for (var i = 0; i < this.accountArr.length; i++) {
             if (item.toLowerCase() === this.accountArr[i].toLowerCase()) {
               questionExists =  true;
               break;
             }
             if (item.indexOf(",") !== -1) {
                let items = item.split(",");
                if (items.length <= this.accountArr.length) {
                  if (item.toLowerCase().indexOf(this.accountArr[i].toLowerCase()) !== -1) {
                    questionExists =  true;
                    break;
                  }
                }
             }
           }
           if (questionExists == true) {
             this.questionObj = [this.Questions[k]._id, this.Questions[k].question, this.Questions[k].account, this.Questions[k].technologyStream,this.Questions[k].questionID];
             this.filteredQuestion.push(this.questionObj);
           }
         }
      }
          this.dataSource.data=this.filteredQuestion as Question[];
          //console.log("Filtered question:"+this.filteredQuestion);
         // console.log("datasource length" +this.dataSource.data.length);
    })
  }

  viewQuestions(qID){
   this.questionID = qID;
   // this.questionID = questionsID;
    console.log("que Id:" +this.questionID);
    this.mode="displayModalBody";
  this.apiService.viewQuestion(this.questionID).subscribe((res) => {
     this.getQuestionDetails = res;
       console.log("res output:" + JSON.stringify(this.getQuestionDetails[0]));
       
     }, (error) => {
         console.log("Error  - " + error);
     });  
    }
  

invokeEdit(){
  this.isEditQuestion = 'Y';
  if (this.isRowSelected == false) {
    alert("Please select the Question");
    return false;
  } else{
    this.isRowSelected = false;
    this.router.navigate(['/question-edit/',this.questionID], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account, qID:this.qID,isEditQuestion:this.isEditQuestion}});
        }
      
  }

removeQuestion(){
  if(this.isRowSelected == false){
    alert("Please select the Question");
    return false;
  } else {
     this.apiService.findUserAnswer(this.qID).subscribe((res) => {
       if (res.count > 0 || res.count == 0) {
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
      console.log("Test" +this.questionID);
    }
    
    clearFilters() {
      this.dataSource.filter = '';
      this.accountFilter = '';
      this.questionFilter = '';
      this.techStreamFilter = '';

   }

  
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
      }
    }

   

    applyFilter(filterValue: string,key: string) {
       this.filterObj = {
             value: filterValue.trim().toLowerCase(),
             key: key
       }
       this.dataSource.filter = filterValue.trim().toLowerCase();
     }

}
