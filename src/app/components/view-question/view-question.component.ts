import { Component, OnInit , NgZone} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { QuizService } from './../../components/quiz/quiz.service';
import { appConfig } from '../../model/appConfig';
import { Question } from 'src/app/model/questions';
//import { ActivatedRoute, Router } from '@angular/router';

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
  }

  pageChange(newPage: number) {
    this.router.navigate(['/view-questionbank'], { queryParams: { page: newPage } });
    console.log("Page Change");
}


//Get all questions
  readQuestion(){
    this.apiService.viewQuizQuestions(this.userName,this.account).subscribe((data) => {
      this.Questions = data;
      console.log("Questions" +this.Questions.length);
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
