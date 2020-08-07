import { Component,NgZone, Input, OnChanges,ViewChild ,Injectable} from '@angular/core';
import { ApiService } from './../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../app.component';
import { PartnerDetails } from './../../../model/PartnerDetails';
import { appConfig } from './../../../model/appConfig';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {TechnicalInterviewListComponent} from '../../technical-interview-list/technical-interview-list.component';
import { SendEmail } from './../../../model/sendEmail';
declare var $: any;

@Component({
  selector: 'app-partner-interview-list',
  templateUrl: './partner-interview-list.component.html',
  styleUrls: ['./partner-interview-list.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class PartnerInterviewListComponent implements OnChanges {
  @Input() groupFilters: Object;
  @Input() searchByKeyword: string;
  users: any[] = [];
  filters: Object;
  filteredUsers: any[] = [];
  Result: any = [];

  public browserRefresh: boolean;
  userName: String = "";
  PartnerInterviewList: any = [];
  config: any;
  accessLevel: String = "";
  mode: string = "";
  emailSelected = "";
  quizNumber;
  candidateDetails: any = [];
  candidateAssessmentDetails: any = [];
  userScore:number=0;
  assesmentDate="";
  questionCount:number=0;
  correctAnswerCount:number=0;
  showModal: boolean = false;
  partnerFeedbackForm: FormGroup;
  submitted = false;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  error = '';
  account: String = ""; 
  usersDetail:any = [];
  usersArray:any = [];
  fromAddress: String = "";
  emailSubject: String = "";
  emailMessage: String = "";
  toAddress: String = "";
  partnerInterviewDetails : any = [];

  constructor(private actRoute: ActivatedRoute, private cv:TechnicalInterviewListComponent,private route: ActivatedRoute, private router: Router, private apiService: ApiService,private ngZone: NgZone,private fb: FormBuilder) {
      this.config = {
        currentPage: appConfig.currentPage,
        itemsPerPage: appConfig.itemsPerPage,
        totalItems: appConfig.totalItems
      };
      this.browserRefresh = browserRefresh;      
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.account = this.router.getCurrentNavigation().extras.state.account;
      }
      // let id = this.actRoute.snapshot.paramMap.get('id');
      // console.log("ID="+id);
      // this.readPartnerInterviewDetails(id);
      route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.getPartnerInterviewList();
      this.mainForm();
  }
  
  mainForm() {
    this.partnerFeedbackForm = this.fb.group({
      partnerFeedback: ['', [Validators.required]]
    })
  }
  @ViewChild('content') content: any;
  ngOnChanges(): void {
    if (this.groupFilters) this.filterUserList(this.groupFilters, this.users);      
    this.router.navigate(['/partner-list']);
  }
  
  ngOnInit() {
      this.accessLevel="partner";
      this.browserRefresh = browserRefresh;
      this.readResult();
  }
   //To download candidate's CV if uploaded
   downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id) 
  }

   //To read candidate details
   getCandidateDetails(username) {
    this.mode="displayModalBody";
    this.apiService.getCandidateDetails(username).subscribe((data) => {
         this.candidateDetails = data;
         if (this.candidateDetails[0].employeeType == 'Contractor') {
              this.displayContractorUIFields = true;
              this.displayRegularUIFields = false;
         } else {
              this.displayContractorUIFields = false;
              this.displayRegularUIFields = true;
         }
    })
}

  pageChange(newPage: number) {
        this.router.navigate(['/partner-list'], { queryParams: { page: newPage } });
  }

  get myForm() {
    return this.partnerFeedbackForm.controls;
  }

  //Read candidate details
  // readPartnerInterviewDetails(id) {
  //   console.log("readPartnerInterviewDetails="+id);
  //   this.apiService.readPartnerInterviewDetails(id).subscribe(data => {
  //     this.partnerInterviewDetails = data;
  //   })
  // }

 // Set email notification parameters
  setEmailNotificationDetails(){        
    this.apiService.getUserByAccessLevel("management").subscribe( (res) => {
    this.usersDetail = res;             
    this.usersArray = [];
    for (var value of this.usersDetail){           
      this.usersArray.push(value.username);        
    }              
    this.toAddress = this.usersArray;        
    }, (error) => {
      this.error = 'Error found while getting username from Users table'
      console.log(error);
    });
  
    this.fromAddress = this.userName;            
    this.emailSubject = "Candidate Assignment Notification";            
    // this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate " 
    //     + this.partnerInterviewDetails[0].result_users[0].employeeName 
    //     + " is added to the queue for job role " + this.partnerInterviewDetails[0].result_users[0].JRSS 
    //     + ".</p><p>Please validate the candidate for new project assignment.</p>\
    //     <p>Regards, <br>DWP Partner Team</p>"; 
    
    this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate is added to the queue for job role.</p><p>Please validate the candidate for new project assignment.</p>\
        <p>Regards, <br>DWP Partner Team</p>"; 
  }
  
  onSubmit() {
    this.submitted = true;
    this.setEmailNotificationDetails();

    if(this.partnerFeedbackForm.value.partnerFeedback.length>0){
      let partnerDetails = new PartnerDetails("Exceptional Approval Given",
      this.partnerFeedbackForm.value.partnerFeedback,this.userName,new Date(), "Skipped");
      this.apiService.updateExceptionalApprovalForStage4(partnerDetails,this.emailSelected,this.quizNumber).subscribe(res => {
        window.alert('Successfully provided exceptional approval');
        this.getPartnerInterviewList();
        this.readResult();
        $("#myModal").modal("hide");

        // Send notification to the operation team                        
        let sendEmailObject = new SendEmail(this.fromAddress, this.toAddress, this.emailSubject, this.emailMessage);
        this.apiService.sendEmail(sendEmailObject).subscribe(
          (res) => {
            console.log("[Partner List Exceptional Approval] - Email sent successfully to " + this.toAddress);            
          }, (error) => {
             console.log("[Partner List Exceptional Approval] - Error occurred while sending email to " + this.toAddress);
             console.log(error);
        });        
        //window.location.reload();
      }, (error) => {
        console.log(error);
      })
    }
  }
 
  exceptionalApproval() {    
    if (this.emailSelected == "") {
      alert("please select the candidate")
    }
    else {
      if (window.confirm("Are you sure you want to provide exemption approval?")) {
        this.showModal = true;
        this.content.open();
        this.partnerFeedbackForm.reset;        
      }
      else {
        this.showModal = false;       
      }
    }
  }
/*
  exceptionalApproval() {
       if (this.emailSelected == "") {
            alert("Please select the candidate")
       }
       if (window.confirm('Are you sure to provide exceptional approval?')) {
        let partnerDetails = new PartnerDetails("Exceptional Approval Given",
                      "Partner Feedback",this.userName,new Date(), "Skipped");
        this.apiService.updateExceptionalApprovalForStage4(partnerDetails,this.emailSelected,this.quizNumber).subscribe(res => {
          window.alert('Successfully provided exceptional approval');
          window.location.reload();
        }, (error) => {
          console.log(error);
        })
        }
  }
*/
  initiateInterview() {
    if (this.emailSelected == "") {
      alert("Please select the candidate")
    }
    else {
      this.router.navigate(['/initiate-partner-interview/', this.emailSelected], { state: { username: this.userName, accessLevel: this.accessLevel, account: this.account } })
    }
  }

  onSelectionChange(value,quizNumber) {
    this.emailSelected = value;
    this.quizNumber=quizNumber;
  }

  getPartnerInterviewList(){      
    if(this.account.toLocaleLowerCase() !=='sector'){      
      this.apiService.getPartnerInterviewAccountList(this.account).subscribe((data) => {
        this.PartnerInterviewList = data;             
      })
    } else {      
    this.apiService.getPartnerInterviewList().subscribe((data) => {
     this.PartnerInterviewList = data;
      })
   }
  }

  filterUserList(filters: any, users: any): void {
    this.filteredUsers = this.users; //Reset User List
    const keys = Object.keys(filters);
    const filterUser = user => {
      let result = keys.map(key => {
        if (key == "employeeName" || key == "JRSS") {
          if (user.result_users[0][key]) {
            return String(user.result_users[0][key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
          }
        }
        else if (user[key]) {
          return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
        } else {
          return false;
        }
      });

      // To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
      result = result.filter(it => it !== undefined);
      return result.reduce((acc, cur: any) => { return acc & cur }, 1)
    }
    this.filteredUsers = this.users.filter(filterUser);
    this.Result = this.filteredUsers;
  }

  // To Read the Results
  readResult() {     
    if(this.account.toLocaleLowerCase() !=='sector'){      
      this.apiService.getPartnerInterviewAccountList(this.account).subscribe((data) => {       
        this.Result = data;
        this.users = data
        this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
      })
    } else {      
      this.apiService.getPartnerInterviewList().subscribe((data) => {        
        this.Result = data;
        this.users = data
        this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
      })
   }    
  }

  getCandidateAssessmentDetails(userid,quizId,username,userScore,createdDate) {
    this.userName=username;
    this.quizNumber=quizId;
    this.userScore=userScore;
    this.assesmentDate=createdDate;
    this.mode="displayAssessmentModalBody";
    this.apiService.getCandidateAssessmentDetails(userid,quizId).subscribe((data) => {
    this.candidateAssessmentDetails = data;
    this.questionCount=this.candidateAssessmentDetails.results.length;
    this.correctAnswerCount=Math.round((userScore*this.questionCount)/100)
   })
}

}
