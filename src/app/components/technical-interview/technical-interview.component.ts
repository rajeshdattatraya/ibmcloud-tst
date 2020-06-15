import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import {TechnicalInterview} from './../../model/technicalinterview';
@Component({
  selector: 'app-technical-interview',
  templateUrl: './technical-interview.component.html',
  styleUrls: ['./technical-interview.component.css']
})
export class TechnicalInterviewComponent implements OnInit {

  techskillForm: FormGroup;
  candidateInterviewDetails:any=[];
  technologyStreamArray:any= [];
  selectedTechStream:any=[];
  scoreArray:any[];
  dynamicArray: any = [];
  newDynamic: any = {};
  JRSS:any;
  totalScore:number=0;
  averageScore:number=0;
  scoreValueArray:any=[];
  submitted = false;
  formReset = false;
  userName: String = "";
  accessLevel: String = "";
  stage3_status: String = "";
  constructor(private fb:FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
    private apiService: ApiService) {
    this.userName =this.router.getCurrentNavigation().extras.state.username;
    let id =this.actRoute.snapshot.paramMap.get('id');
    this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    this.readCandidateTechnicalInterviewDetails(id);
    this.techskillForm = this.fb.group({
        finalscore:'',
        finalResult:['',Validators. required],
        feedback:['',Validators. required],
        // smeName:['',Validators. required],
        techStream: this.fb.array([]) ,
      });

  }
  ngOnInit(): void {
    this.getTechnicalStreamFromJRSS();
  }
  techStream() : FormArray {
      return this.techskillForm.get("techStream") as FormArray
  }

  //Read candidate details
  readCandidateTechnicalInterviewDetails(id) {
    this.apiService.readTechInterviewDetails(id).subscribe(data => {
    console.log("readTechInterviewDetails data ="+data);
    for(var candidate of data){
       var userScore:number=candidate.userScore;

       if(userScore>=80){
        this.candidateInterviewDetails.push(candidate);
        break;
       }
     }
    });
  }


  createTechStream(): FormGroup {
    return this.fb.group({
      technologyStream:this.getTechnologyStream(),
      score: '0'
    })

  }

   // Getter to access form control
   get myForm(){
    return this.techskillForm.controls;
  }

  getTechnicalStreamFromJRSS(){
     this.apiService.getJRSS().subscribe((data) => {
     this.JRSS = data;
     this.technologyStreamArray = [];
     for (var jrss of this.JRSS){
        for (var skill of jrss.technologyStream){
          this.technologyStreamArray.push(skill);
        }
      }
      this.newDynamic =this.technologyStreamArray;
      this.dynamicArray.push(this.newDynamic);
      this.techStream().push(this.createTechStream());
      //console.log("Technical Stream getjrss: "+ JSON.stringify(this.technologyStreamArray));
      console.log(this.technologyStreamArray.get("key"));
    })
  }

  getTechnologyStream() {
    return this.technologyStreamArray;
  }

  changeSelectTechStream(i:number) {
    if(i<(this.newDynamic.length-1)){
     this.selectedTechStream=[];
     var selectedStream:any=[]=this.techskillForm.value.techStream;
      for(var sc of selectedStream){
        var technology=sc.technologyStream;
        this.selectedTechStream.push(sc.technologyStream);
        }
     }
  }

  addTechStream(i:number) {
    if(i<(this.newDynamic.length-1)){
     this.selectedTechStream=[];
     var selectedStream:any=[]=this.techskillForm.value.techStream;
      for(var sc of selectedStream){
        var technology=sc.technologyStream;
        this.selectedTechStream.push(sc.technologyStream);
      }
      this.newDynamic =this.getTechnologyStream();
      this.dynamicArray.push(this.newDynamic);
      this.techStream().push(this.createTechStream());
    }
  }

  removeTechStream(i:number) {

    if(this.dynamicArray.length ==1) {
        return false;
    } else {
        this.techStream().removeAt(i);
        this.dynamicArray.splice(i, 1);
        this.averageCalc("");
        return true;
    }


  }
  averageCalc(txtValue:string){
    this.totalScore=0;
    this.scoreValueArray=this.techskillForm.value.techStream;
    var scoreCount:number=0;
    for(var sc of this.scoreValueArray){
     var score:number=parseInt(sc.score);
      if(score>0){
        this.totalScore= this.totalScore + score;
        scoreCount++;
      }
    }
    this.averageScore=this.totalScore/scoreCount;
    if(isNaN(this.averageScore))
      this.averageScore=0;
      this.dynamicFormControlValidation();
   }

   //Reset
  resetForm(){
    this.formReset = true;
    this.techskillForm.reset();
    this.averageScore=0;
    var dynamicArrayLen:number=this.dynamicArray.length;
    for(var cnt=dynamicArrayLen;cnt>1;cnt--);
      this.removeTechStream(cnt);
    this.techskillForm.value.score=0;
   // this.ngZone.run(() => this.router.navigateByUrl('/technical-list',{state:{username:this.userName}}))
  }
//Cancel
 cancelForm(){
     this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.userName}}))
 }

 isNumber(evt,rowCount) {
  var iKeyCode = (evt.which) ? evt.which : evt.keyCode
  if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
      return false;
  var scoreValueArray1:any=[];
  var count:number=0;
  scoreValueArray1=this.techskillForm.value.techStream;
  for(var sc of scoreValueArray1){
    if(count==(parseInt(rowCount))){
      var score:number=0;
      score=parseInt(sc.score);
      if((score==1 && iKeyCode>48)){
      return false;
      }else if((score>1 && iKeyCode>47)){
        return false;
      }
    }
    count++;
  }
  return true;
}
 dynamicFormControlValidation(){
   if(this.averageScore==0){
     this.techskillForm.get("finalscore").setValidators([Validators.required])
     this.techskillForm.get("finalscore").updateValueAndValidity();
   }else{
    this.techskillForm.get("finalscore").clearValidators();
    this.techskillForm.get("finalscore").updateValueAndValidity();
   }
 }

  onSubmit() {

    this.submitted = true;
    this.dynamicFormControlValidation();
    if (!this.techskillForm.valid) {
      return false;
    } else {
      let userName=this.candidateInterviewDetails[0].userName;
      let userScore=this.candidateInterviewDetails[0].userScore;
      let quizNumber=this.candidateInterviewDetails[0].quizNumber;
      if (this.techskillForm.value.finalResult === 'Recommended' || this.techskillForm.value.finalResult === 'Strongly Recommended') {
          this.stage3_status = 'Completed';
      } else {
          this.stage3_status = 'Not Started';
      }
      this.apiService.getResultByUser(userName,quizNumber).subscribe(res => {
          //console.log('get the result data'+res['_id']+"\t"+ res['userName']);
            let updateResults=new TechnicalInterview(userName,userScore, quizNumber,
            this.techskillForm.value.techStream,
            this.averageScore,
            this.techskillForm.value.finalResult,
            this.techskillForm.value.feedback,
            this.userName,
            this.stage3_status);

			      this.apiService.updateResults(res['_id'],updateResults).subscribe(res => {
            console.log('Candidate SME Interview Details updated successfully!');
            alert("SME Interview Details saved successfully.");
            this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
            }, (error) => {
            console.log(error);
            })
          }, (error) => {
          console.log(error);
      })
    }
  }
}
