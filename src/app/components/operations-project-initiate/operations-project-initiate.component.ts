import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { OperationsDetails } from './../../model/OperationsDetails';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';
import { SendEmail } from './../../model/sendEmail';
import { OpenPositionService } from 'src/app/service/openPosition.service';
import { PositionsService } from '../open-positions-list/positions.service';
declare var $: any;

@Component({
  selector: 'app-operations-project-initiate',
  templateUrl: './operations-project-initiate.component.html',
  styleUrls: ['./operations-project-initiate.component.css']
})
export class OperationsProjectInitiateComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  operationsProjectDetails : any = []; 
  ProjectLocation: any=['Onshore','Offshore'];
  ClientProject: any=['DWP','HMRC','SG'];
  operationsProjectForm: FormGroup;
  submitted = false;
  formReset = false;
  accessLevel: string = "";
  status: string = "Completed";
  displayTechInterviewFields = true;
  displayPartnerInterviewFields = true;
  account: String = "";
  onLoad = false;

 constructor(private cv:TechnicalInterviewListComponent,
  public fb: FormBuilder, 
  private actRoute: ActivatedRoute, 
  private router: Router,
  private ngZone: NgZone,
  private apiService: ApiService,
  private openPositionService: OpenPositionService,
  private positionsService: PositionsService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;          
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;  
       this.account = this.router.getCurrentNavigation().extras.state.account;  
       this.positionID = this.router.getCurrentNavigation().extras.state.positionID;        
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readOperationsProjectDetails(id); 
       this.mainForm();     
   }

   ngOnInit() {
        this.browserRefresh = browserRefresh;
        this.onLoad = true;
        if (this.browserRefresh) {
            window.alert('You are redirected to login screen.');
            this.router.navigate(['/login-component']);
        }
        //Sprint8 start
        if (this.positionID != null ||  this.positionID != undefined) {
          this.readOpenPositionsByPositionID();
        } else {
          //if position is not already selected then display the positions in dropdown 
          this.displayPositionDropDown=true;
         
          
        }
        this.readPositionLocation();
       
        //Sprint8 End
   }

  mainForm() {
    this.operationsProjectForm = this.fb.group({
      projectLocation: ['', [Validators.required]],
      clientProject: ['', [Validators.required]],
       projectPosition: ['', [Validators.required]],
      managementComments: ['', [Validators.required]]
    })
}

get myForm(){
  return this.operationsProjectForm.controls;
}

  skipMethod(){
    alert('Stage skipped');
  }
  //To download candidate's CV if uploaded
  downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id) 
  }

  // Choose Location with select dropdown
  updateLocation(e){    
    this.operationsProjectForm.get('projectLocation').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Location with select dropdown
  updateClientProject(e){
    this.operationsProjectForm.get('clientProject').setValue(e, {
    onlySelf: true
    })
  }

  //Read candidate project details
  readOperationsProjectDetails(id) {
    this.apiService.readOperationsProjectDetails(id).subscribe(data => {
      this.operationsProjectDetails = data;
     if(this.operationsProjectDetails[0].stage3_status === 'Skipped') {
          this.displayTechInterviewFields = false;
      }
      if(this.operationsProjectDetails[0].stage4_status === 'Skipped') {
          this.displayPartnerInterviewFields = false;
      }

      //Sprint8 start
      this.candidateLocation = this.operationsProjectDetails[0].result_users[0].userPositionLocation;
      this.grossProfit = this.operationsProjectDetails[0].result_users[0].grossProfit;
      this.candidateLOB = this.operationsProjectDetails[0].result_users[0].userLOB;
      this.candidateBand = this.operationsProjectDetails[0].result_users[0].band;
      this.candidateJRSS = this.operationsProjectDetails[0].result_users[0].JRSS;
      this.positionName = this.operationsProjectDetails[0].result_users[0].openPositionName;
      this.oldCandidateLocation = this.candidateLocation;
   //   this.readOpenPositionsByPositionName();

      this.listAllOpenPositions()
      //Sprint8 End

    });
  }

  onSubmit(id) {

    if (this.positionID === null ||  this.positionID === undefined) {
      window.alert("Please select an appropriate position for the selected candidate.");
              return false;
    }

    this.submitted = true;

    // Set Email parameters
    let fromAddress = this.userName;    
    let toAddress = this.operationsProjectDetails[0].result_users[0].username;    
    let emailSubject = "Project Assignment Notification";    
    let emailMessage = "Dear " 
        + this.operationsProjectDetails[0].result_users[0].employeeName 
        + ",<br> <p>We would like to confirm, you have been selected for a " 
        + this.operationsProjectForm.value.projectPosition + " role in " 
        + this.operationsProjectForm.value.clientProject + " account. </p><p>" 
        + this.operationsProjectForm.value.clientProject + " account operations team will connect with you shortly for next steps.</p>\
        <p>Regards, <br>DWP Operations Team</p>";
    
    if (!this.operationsProjectForm.valid) {
      console.log("this.operationsProjectForm", this.operationsProjectForm.value);
      return false;
    } else {
    let operationsDetails = new OperationsDetails(this.operationsProjectDetails[0].result_users[0].username, 
                              this.operationsProjectForm.value.projectLocation,
                              this.operationsProjectForm.value.clientProject,
                              this.operationsProjectForm.value.projectPosition, 
                              this.operationsProjectForm.value.managementComments, 
                              this.userName, new Date());

    // Insert into projectAlloc table
    this.apiService.insertOperationsDetails(operationsDetails).subscribe(
      (res) => {
          // Update Results table
          this.apiService.saveOperationsStatus(id, status).subscribe(
            (res) => {
              window.alert("Project Assignment detail is successfully submitted");
              console.log("Operations stage status successfully updated to Results table!");

            // method to close the position;
            if (this.positionID != null ||  this.positionID != undefined) {
              this.positionsService.closePositionByID(this.positionID, this.positionStatus).subscribe(
                (res) => {
                    console.log("Position closed successfully");            
                });
              
            }
           
            //******/
              // Send notification to the candidate
              let sendEmailObject = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage);
              this.apiService.sendEmail(sendEmailObject).subscribe(
                (res) => {
                    console.log("Email sent successfully to " + toAddress);            
                }, (error) => {
                    console.log("Error occurred while sending email to " + toAddress);
                    console.log(error);
              });

            }, (error) => {
              console.log(error);
            });
        console.log('Operations details successfully inserted to ProjectAlloc table!')
        this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
        }, (error) => {
          console.log(error);
        });
  }
}

//Reset
resetForm(){
 this.formReset = true;
 this.operationsProjectForm.reset();
}
//Cancel
cancelForm(){
  if (this.displayPositionDropDown) {
    this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
  } else {
    this.ngZone.run(() => this.router.navigateByUrl('/open-positions-list',{state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
  }
  
  
}

//*************** Sprint 8 coding -  added sections to display open positions and to GP calculations  ********************/
grossProfit;
UserPositionLocation:any=[];
competencyLevel:any=[];
rateCardJobRole:any=[];
positionLocation:any=[];
OJRSS: any= [];
lineOfBusiness:any=[];
candidateJRSS='';;
displayOpenPositionFields=true;
positionDetails:any = [];
rateCardLOB='';
rateCardLocation='';
rateCardComplexityLevel='';
rateCardRole='';
candidateLocation='';
candidateBand ='';
candidateLOB ='';
positionID;
positionStatus='Close';
openPositionsList:any = [];

pageChange:any;
jrssSelected=false;
itemsPerPage = 10;
page=1;
linkPosition=false;
displayPositionDetails=false;
displayPositionDropDown=false;
positionName;

  // To Read the Open Position by JRSS
  listAllOpenPositions() {
    const status="Open";
  //this.positionsService.listAllOpenPositions(this.account, status).subscribe((data) => {
   // this.openPositionsList = data;

    this.openPositionService.listAllOpenPositionsBYJRSS(this.account, 
      status,this.candidateJRSS).subscribe((data) => {
      this.openPositionsList = data;
    
  })
}


oldCandidateLocation;
getGPByCandidateLocation(userSelectedCandidateLocation) {
  this.displayPositionDetails = true;
  if (userSelectedCandidateLocation != null ||  userSelectedCandidateLocation != undefined) {
    
    this.candidateLocation = userSelectedCandidateLocation;
    this.calculateGP();
   
  }
}

getSelectedPositionDetails(positionID) {
  this.displayPositionDetails = true;
  this.positionID = positionID
  if (this.positionID != null ||  this.positionID != undefined) {
    this.readOpenPositionsByPositionID();
   
  }
}

 // Get all PositionLocation
 readPositionLocation(){
  this.openPositionService.getPositionLocations().subscribe((data) => {
     this.positionLocation = data;
  });
}



/*Get position details by position id */

 // To Read the Open Position
 readOpenPositionsByPositionID() {
  this.openPositionService.readOpenPosition(this.positionID).subscribe((data) => {
    this.positionDetails = data;
    console.log('this.positionDetails inside pos by ID ***** ',data);
    
    this.rateCardLOB = data['lineOfBusiness']
    this.rateCardLocation = data['positionLocation']
    this.rateCardRole = data['rateCardJobRole']
    this.rateCardComplexityLevel= data['competencyLevel']
    this.calculateGP();
    
  })
}


 // To Read the Open Position by position Name
 readOpenPositionsByPositionName() {
  this.displayPositionDetails = true;
  this.openPositionService.readOpenPositionByPositionName(this.positionName).subscribe((data) => {
    this.positionDetails = data;
    console.log('this.positionDetails inside pos by NAME ***** ',data);
    this.rateCardLOB = data['lineOfBusiness']
    this.rateCardLocation = data['positionLocation']
    this.rateCardRole = data['rateCardJobRole']
    this.rateCardComplexityLevel= data['competencyLevel']
    this.positionID = data['_id'];
    this.calculateGP();
    
  })
}


     calculateGP() {

      if ((this.rateCardLocation == null || this.rateCardLocation == '' ) && this.onLoad==false) {
         window.alert("Please select Open Position/Candidate Position Location");
         return false;
      }
     
      let GP: number = 0;
      let rateCardValue: number = 0;
      let costCardValue: number = 0;
      let costCardCode = ""
      let rateCardCode = ""
       rateCardCode = this.rateCardLOB + " - " + this.rateCardLocation + " - " +
         this.rateCardRole + " - " + this.rateCardComplexityLevel;

       if (this.candidateBand == 'Exec'
         || this.candidateBand == 'Apprentice'
         || this.candidateBand == 'Graduate') {
         costCardCode = this.candidateLocation + " - " + this.candidateLOB
           + " - " + this.candidateBand
       } else {
         costCardCode = this.candidateLocation + " - " + this.candidateLOB
           + " - Band-" + this.candidateBand
       }

     this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
        rateCardValue = data['rateCardValue'];
         
        this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
           costCardValue = data['costCardValue'];
          
           if (rateCardValue == null && this.onLoad == false) {
              window.alert("No cost details available, choose a different position.");
              this.candidateLocation = this.oldCandidateLocation;
              return false;
           } else if (costCardValue == null && this.onLoad == false) {
            window.alert("No rate card details available, choose a different candidate location.");
            this.candidateLocation = this.oldCandidateLocation;
            return false;
         } else {
          this.oldCandidateLocation = this.candidateLocation;
            this.grossProfit = Math.round(((rateCardValue-costCardValue)/costCardValue)*100)
           }
           this.onLoad = false;
        })
     })
  }

}
