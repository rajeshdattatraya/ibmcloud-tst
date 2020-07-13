import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { OperationsDetails } from './../../model/OperationsDetails';
import {TechnicalInterviewListComponent} from '../technical-interview-list/technical-interview-list.component';
import { SendEmail } from './../../model/sendEmail';

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

 constructor(private cv:TechnicalInterviewListComponent,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
  private apiService: ApiService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;          
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;            
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readOperationsProjectDetails(id); 
       this.mainForm();     
   }

   ngOnInit() {
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
            window.alert('You are redirected to login screen.');
            this.router.navigate(['/login-component']);
        }
   }

  mainForm() {
    this.operationsProjectForm = this.fb.group({
      projectLocation: ['', [Validators.required]],
      clientProject: ['', [Validators.required]],
      projectName: ['', [Validators.required]],
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
    });
  }

  onSubmit(id) {
    this.submitted = true;

    // Set Email parameters
    let fromAddress = "tsttool2020@gmail.com";
    let fromPassword = "tst@2020";
    let toAddress = this.operationsProjectDetails[0].result_users[0].username;    
    let emailSubject = "Project Assignment Notification";   
    let emailMessage = "Dear " + this.operationsProjectDetails[0].result_users[0].employeeName + ",<br> \
      <p>This is to formally notify you of your New assignment within DWP IBM India. The details of your assignment are given below.<br> </p><p>&emsp;&emsp;&emsp;\
      Employee Name : " +this.operationsProjectDetails[0].result_users[0].employeeName+ "<br>&emsp;&emsp;&emsp;\
      Location : " +this.operationsProjectForm.value.projectLocation+ "<br>&emsp;&emsp;&emsp;\
      Client : " + this.operationsProjectForm.value.clientProject + "<br>&emsp;&emsp;&emsp;\
      Project Name : " + this.operationsProjectForm.value.projectName + "<br>&emsp;&emsp;&emsp;\
      Project Position : " +this.operationsProjectForm.value.projectPosition+ "</p>\
      <p>This email is to be treated as a formal communication to you, notifying you of your new assignment.  It is the employee's responsibility to contact the manager, and initiate the assignment. If you are unable to do so despite all efforts, please contact  your People Manager or IBM Human Resources. </p>\
      <p>I wish you all the best in your new assignment, and look forward to you contributing productively to the Company!</p> \
      <p>From, <br>DWP Team and Management</p>";   
    
    if (!this.operationsProjectForm.valid) {
      return false;
    } else {
    let operationsDetails = new OperationsDetails(this.operationsProjectDetails[0].result_users[0].username, this.operationsProjectForm.value.projectLocation,this.operationsProjectForm.value.clientProject,
      this.operationsProjectForm.value.projectName, this.operationsProjectForm.value.projectPosition, this.operationsProjectForm.value.managementComments, this.userName, new Date());

    // Insert into projectAlloc table
    this.apiService.insertOperationsDetails(operationsDetails).subscribe(
      (res) => {
          // Update Results table
          this.apiService.saveOperationsStatus(id, status).subscribe(
            (res) => {
              window.alert("Project Assignment detail is successfully submitted");
              console.log("Operations stage status successfully updated to Results table!");

              // Send notification to the candidate
              let sendEmailObject = new SendEmail(fromAddress, toAddress, emailSubject, emailMessage, fromPassword);
              this.apiService.sendEmail(sendEmailObject).subscribe(
                (res) => {
                    console.log("Email sent successfully to " + this.operationsProjectDetails[0].result_users[0].username);            
                }, (error) => {
                    console.log("Error occurred while sending email to " + this.operationsProjectDetails[0].result_users[0].username);
                    console.log(error);
              });

            }, (error) => {
              console.log(error);
            });
        console.log('Operations details successfully inserted to ProjectAlloc table!')
        this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
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
  this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
}
}
