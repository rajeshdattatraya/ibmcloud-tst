import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Candidate } from './../../model/candidate';
import { UserDetails } from './../../model/userDetails';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { browserRefresh } from '../../app.component';
import * as CryptoJS from 'crypto-js';
import { SpecialUser } from './../../model/specialUser';

@Component({
  selector: 'app-adminuser-create',
  templateUrl: './adminuser-create.component.html',
  styleUrls: ['./adminuser-create.component.css']
})
export class AdminuserCreateComponent implements OnInit {
  error = '';
  public browserRefresh: boolean;
  submitted = false;
  candidateForm: FormGroup;
  JRSS:any = []
  Band:any = [];
  quizNumber: number;
  userName: String = "admin";
  password: String = "";
  currDate: Date ;
  technologyStream:any= [];
  skillArray:any= [];  
  Userrole:any = [];
  userrole: String = "";
  AdminUsers:any = [];
  username;
  index;
  docid;
  isRowSelected = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    
    this.password = appConfig.defaultPassword;
    this.quizNumber = 1;
    this.mainForm();
    this.readUserrole();    
    this.getAllSpecialUsers();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
        if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
           this.router.navigate(['/login-component']);
        }
    }
  }

  mainForm() {
    this.candidateForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      userrole: ['', [Validators.required]],
    })
  }

    // Get all userroles
    readUserrole(){
      this.apiService.getUserroles().subscribe((data) => {
      this.Userrole = data;
      })
   }

   // Choose userrole with select dropdown
   updateUserroleProfile(e){
    this.candidateForm.get('userrole').setValue(e, {
    onlySelf: true
    })
  }

  // Getter to access form control
  get myForm(){
    return this.candidateForm.controls;
  }

  //get All special users (e.g. sme, partner etc)
  getAllSpecialUsers(){
    this.apiService.findAllUser().subscribe((data) => {
    this.AdminUsers = data;
    })
}

// Delete the selected user
  //To remove candidate
  removeUser(username, index) {
    if(this.isRowSelected == false){
      alert("Please select the user");
    }else{
    if(window.confirm('Are you sure?')) {
        this.apiService.deleteUser(username).subscribe((data) => {
          this.AdminUsers.splice(index, 1);
        }
      )
      this.getAllSpecialUsers();
      this.isRowSelected = false;
    }
  }
  }

  onSelectionChange(username,docId,i){
    this.username=username;
    this.index=i;
    this.docid = docId;
    this.isRowSelected=true;

  }

  canExit(): boolean{
    if (this.candidateForm.dirty && !this.submitted){
      if(window.confirm("You have unsaved data in the Create Candidate form. Please confirm if you still want to proceed to new page")){
        return true;
      } else {
      return false;
      }
    } else {
      return true;
    }
  }

  invokeEdit(){
    if(this.isRowSelected == false){
      alert("Please select the user");
      }else{
      this.router.navigate(['/edit-user/', this.docid]);
      }
    }

  onSubmit() {
    this.submitted = true; 
    // Encrypt the password
    var base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
    var ivMode = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    this.password = CryptoJS.AES.encrypt(appConfig.defaultPassword.trim(),base64Key,{ iv: ivMode }).toString();
    this.password = this.password.replace("/","=rk=");    
     

    let user = new SpecialUser(this.candidateForm.value.email,
     this.password,
     this.quizNumber,
     "Active",
     this.candidateForm.value.userrole,
     this.userName,
     new Date(),
     this.userName,
     new Date(),
     this.candidateForm.value.dateOfJoining,
     "false",
     this.candidateForm.value.employeeName
     );


     this.currDate = new Date();
     
    if (!this.candidateForm.valid) {
      return false;
    } else  {
        console.log("in candidate-create.ts");
        this.apiService.findUniqueUserEmail(this.candidateForm.value.email).subscribe(
          (res) => {
            console.log('res.count inside response ' + res.count)
           if (res.count > 0)
           {
              console.log('res.count inside if ' + res.count)
              window.confirm("Please use another Email ID");
            } 
            else 
            {
            if (res.count == 0)
            { this.apiService.createUserDetails(user).subscribe(
              (res) => {
                          console.log('User successfully created!')
                          alert('User successfully created!');
                          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                          this.router.navigate(['/adminuser-create']));
                       }, (error) => {
                          console.log(error);
                       });
              
            }}        
          }, (error) => {
      console.log(error);
    }
  )
  }
  
}

}
