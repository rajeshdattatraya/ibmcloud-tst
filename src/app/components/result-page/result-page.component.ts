import { Component, OnInit } from '@angular/core';
import { Question } from './../../model/questions';
import { QuizService } from './../../components/quiz/quiz.service';
import { UserResultWorkFlow } from './../../model/userResultWorkFlow';
import { ApiService } from './../../service/api.service';
import { browserRefresh } from '../../app.component';
import { ResultPageService } from './../../components/result-page/result-page.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { TestConfigService } from './../../service/testconfig.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent implements OnInit {
  public browserRefresh: boolean;
  userAnswers: any = [];
  displayMsg: string = '';
  numberOfCorrectAns: number = 0;
  scorePercentage: string = '';
  status = "";
  username;
  quizNumber;
  passingScore;
  mode;
  jrss = "";
  stage2_status;
  stage1;
  stage2;
  stage3;
  stage4;
  stage5;
  userResult;
  candidateAccount:any;

  constructor(
    private router: Router,
    private quizService: QuizService,
    private resultPageService: ResultPageService,
    private apiService: ApiService,
    private testconfigService: TestConfigService,
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.username = this.router.getCurrentNavigation().extras.state.username;
      this.quizNumber = this.router.getCurrentNavigation().extras.state.quizNumber;
      this.mode = this.router.getCurrentNavigation().extras.state.mode;
    }
  }


  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
        this.router.navigate(['/login-component']);
      }
    }
    this.showResult();
  }

  showResult() {    
    this.quizService.getUserResults(this.username, this.quizNumber).subscribe(
      (res) => {
        if (this.mode == 'quiz') {
          this.mode = 'Sorry,You have run out of time.'
        }
        else {
          this.mode = "";
        }
        this.userAnswers = res;
        this.userAnswers.forEach((userAns) => {
          console.log("userAns.userAnswerID ", userAns.userAnswerID, "  userAns.answerID ", userAns.answerID);
          if (userAns.userAnswerID == userAns.answerID) {
            this.numberOfCorrectAns = this.numberOfCorrectAns + 1;
          }
        }, (error) => {
          console.log(error);
        });
        this.scorePercentage = (Math.round(this.numberOfCorrectAns * 100) / this.userAnswers.length).toFixed(2);
        this.numberOfCorrectAns = Math.round(this.numberOfCorrectAns * 100) / this.userAnswers.length;


        //Sprint2: Save the quiz results for the user into 'Results' collection
        // Read the candidate JRSS by username
        this.apiService.getCandidateJrss(this.username).subscribe((res) => {
          this.jrss = res['JRSS'];
          this.candidateAccount = res['account'];
          // Read the work flow details by reading jrss record by jrss name.
          this.apiService.getJrss(this.jrss).subscribe((res) => {
            let data;
            this.testconfigService.findTestConfigByJRSS(this.jrss,this.candidateAccount).subscribe(
              (data) => {
                this.passingScore = data['passingScore']
                if (this.numberOfCorrectAns >= this.passingScore) {
                  this.displayMsg = "Congratulations on completing the exam."
                } else {
                  this.displayMsg = "Thank you for completing the online assessment test, account hiring manager will come back to you shortly."
                }

            if (res['stage1_OnlineTechAssessment'] && this.numberOfCorrectAns >=this.passingScore) {
              this.stage1 = "Completed";
            } else if(res['stage1_OnlineTechAssessment'] && this.numberOfCorrectAns <this.passingScore){
              this.stage1 = "Not Started";
            } else {
              this.stage1 = "Skipped";
            }
            if (res['stage2_PreTechAssessment']) {
              this.stage2_status = "Not Started"
              this.stage2 = "Not Started";
            } else {
              this.stage2 = "Skipped";
              this.stage2_status = "Skipped"
            }
            if (res['stage3_TechAssessment']) {
              this.stage3 = "Not Started";
            } else {
              this.stage3 = "Skipped";
            }
            if (res['stage4_ManagementInterview']) {
              this.stage4 = "Not Started";
            } else {
              this.stage4 = "Skipped";
            }
            if (res['stage5_ProjectAllocation']) {
              this.stage5 = "Not Started";
            } else {
              this.stage5 = "Skipped";
            }

            if (this.numberOfCorrectAns >= this.passingScore) {
              this.userResult = "Pass";
            } else {
              this.userResult = "Fail";
            }
             let userResultWokFlow = new UserResultWorkFlow(this.username, Number(this.scorePercentage), this.userResult,
                this.quizNumber, this.stage1, this.stage2, this.stage3, this.stage4, this.stage5);
                data = JSON.stringify(userResultWokFlow);
                this.resultPageService.saveResult(data).subscribe(
                  (res) => {
                    console.log('Quiz results for the user have been successfully saved!');
                  }, (error) => {
                    console.log(error);
                  });
              });
              }, (error) => {
                console.log(error);
              })
            });
        //Update user loggedin status to false
        this.apiService.updateUserLoggedinStatus(this.username, 'false').subscribe(
          (res) => {
            console.log('Status column updated successfully in Users table');
          }, (error) => {
            console.log("Error found while updating status column of Users table - " + error);
          });

      });
  }
}
