import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { PreTechService } from './../../components/pre-tech-form/pre-tech-service';
import { PreTechQuesAndAns } from './../../model/PreTechQuesAndAns';



@Component({
  selector: 'app-pre-technical-interview-form',
  templateUrl: './pre-technical-interview-form.component.html',
  styleUrls: ['./pre-technical-interview-form.component.css']
})
export class PreTechnicalInterviewFormComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  accessLevel: String = "";
  TechnicalInterviewList: any = [];
  config: any;
  preTechAssmntQuestions:any = [];
  preTechQuesAndAns: PreTechQuesAndAns[] = [];
  access:any = this.router.getCurrentNavigation().extras.state.access;
  
  username =this.route.snapshot.paramMap.get('username');




  constructor(private route: ActivatedRoute,	private preTechService: PreTechService,
    private router: Router, private apiService: ApiService) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 5,
        totalItems:0
      };
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          console.log("accessLevel*",this.accessLevel);
        }
        route.queryParams.subscribe(
          params => this.config.currentPage= params['page']?params['page']:1 );
      
      let jrss =this.route.snapshot.paramMap.get('jrss');
      let username =this.route.snapshot.paramMap.get('username');
      this.access = this.router.getCurrentNavigation().extras.state.access;
      console.log("access------*",this.access);


      this.getPreTechnicalAssessmentDetails(jrss,username,this.access);
  }

  ngOnInit(): void {
   
  }



  close() {
    if(this.access =='tech-list'){
      this.router.navigate(['/technical-interview-list'], { state: { username: this.userName, accessLevel: this.accessLevel } })   
    }
     if(this.access =='tech-interview-initiate'){
      this.router.navigate(['/technical-list/', this.userName], { state: { username: this.userName, accessLevel: this.accessLevel } })
     }
  }


  getPreTechnicalAssessmentDetails(jrss,username,access) {
    console.log('username--'+username);
    console.log('jrss--'+jrss);
    console.log('accesslevl----'+access);
    this.preTechQuesAndAns = [];    
    this.preTechService.getPreTechAssessmentQuestions(jrss,username).subscribe(res => {
    this.preTechAssmntQuestions = res;
    this.preTechAssmntQuestions.forEach((quesAndAnswer) => { 
  	console.log('quesAndAnswer.PreTechAnswers.length--'+quesAndAnswer.PreTechAnswers.length)
    var answer = "";
    var test = "";
    if (quesAndAnswer.PreTechAnswers.length > 0) {
         answer = quesAndAnswer.PreTechAnswers[0].answer ;
         test = quesAndAnswer.preTechQuestion;
    }
    this.preTechQuesAndAns.push(new PreTechQuesAndAns(quesAndAnswer.preTechQID, quesAndAnswer.jrss,
    test,this.userName, answer));
    console.log('length of array--'+this.preTechQuesAndAns.length);
    console.log('question--'+this.preTechQuesAndAns[0].preTechQuestion);
    console.log('response--'+this.preTechQuesAndAns[0].answer);
     });
           }, (error) => {
           console.log(error);
           });
  }
  
}
