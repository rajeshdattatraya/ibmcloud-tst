import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Candidate } from './../../model/candidate';
import { UserDetails } from './../../model/userDetails';
import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { User } from './../../model/user';
import { browserRefresh } from '../../app.component';
import * as CryptoJS from 'crypto-js';
import { SpecialUser } from './../../model/specialUser';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-superadmin-user-create',
  templateUrl: './superadmin-user-create.component.html',
  styleUrls: ['./superadmin-user-create.component.css']
})
export class SuperadminUserCreateComponent implements OnInit {

  error = '';
  public browserRefresh: boolean;
  formReset = false;
  submitted = false;
  candidateForm: FormGroup;
  JRSS:any = []
  Band:any = [];
  quizNumber: number;
  userName: String = "admin";
  account: any;
  accessLevel: any;
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
  Account:any = [];
  AccountList:any=[];
  accountArray:any= [];
  selectedUserrole: String = "";

  loading = true;
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['Action','name', 'username','accessLevel','account'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.password = appConfig.defaultPassword;
    this.quizNumber = 1;
    this.mainForm();
    this.readUserrole();    
    this.getAllSpecialUsers();
    this.readAccount();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
        if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
           this.router.navigate(['/login-component']);
        }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  mainForm() {
    this.candidateForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      userrole: ['', [Validators.required]],
      account: ['', [Validators.required]],
    })
  }

    // Get all userroles
    readUserrole(){
      this.apiService.getUserroles().subscribe((data) => {
      this.Userrole = data;
      })
   }

    // Choose account with select dropdown
    updateAccountProfile(e){
       this.candidateForm.value.account = e.source.value;
    }

   // Choose userrole with select dropdown
   updateUserroleProfile(e){
    this.selectedUserrole = e;
    if(this.selectedUserrole === 'admin'){
      this.AccountList.length=0;
      for (var accValue of this.Account){
      if(accValue.account.toLowerCase() !== 'sector' ) {
        this.AccountList.push(accValue);
      }
    }
  }if(this.selectedUserrole !== 'admin'){
    this.AccountList.length=0;
    for (var accValue of this.Account){
      if(accValue.account.toLowerCase() === 'sector' ) {
        this.AccountList.push(accValue);
      }
    }
  }    this.candidateForm.get('userrole').setValue(e, {
    onlySelf: true
    }) 
   }

  // Getter to access form control
  get myForm(){
    return this.candidateForm.controls;
  }

  //get All admin users
  getAllSpecialUsers(){
    this.apiService.findSectorAdminAndAccountUsers().subscribe((data) => {
    this.AdminUsers = data;
    this.dataSource.data = data as User[];
    })
}

    // Get all Acconts
    readAccount(){
      this.apiService.getAccounts().subscribe((data) => {
      this.Account = data;
      //Remove 'sector' from Account collection
      console.log('userrole selected in readAccount---'+this.selectedUserrole);     
    })
    }

     // Choose account result with select dropdown
     updateAccountDetails(e) {
      this.candidateForm.value.account = e.source.value;
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
      this.router.navigate(['/superadmin-edit-user/', this.docid],{state:{username:this.userName,account:this.account,accessLevel:this.accessLevel}});
      }
    }

  onSubmit() {
    this.submitted = true;
    this.formReset = false;
    // Encrypt the password
    var base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
    var ivMode = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    this.password = CryptoJS.AES.encrypt(appConfig.defaultPassword.trim(),base64Key,{ iv: ivMode }).toString();
    this.password = this.password.replace("/","=rk=");    
     
      this.accountArray = [];
      for (var account of this.candidateForm.value.account)  {
        if(this.accountArray.indexOf(account.account == -1)){
            this.accountArray.push(account.account);
        }
      }
      this.candidateForm.value.account = this.accountArray.join(',');
        //Remove the leading comma if any
      if (this.candidateForm.value.account.substr(0,1) == ",") {
        this.candidateForm.value.account = this.candidateForm.value.account.substring(1);
      }

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
     this.candidateForm.value.employeeName,
     this.candidateForm.value.account
     );


     this.currDate = new Date();
     
    if (!this.candidateForm.valid) {
      return false;
    } else  {        
        this.apiService.findUniqueUserEmail(this.candidateForm.value.email).subscribe(
          (res) => {            
           if (res.count > 0)
           {              
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
                          this.router.navigate(['/superadmin-user-create'],{state:{username:this.userName,account:this.account,accessLevel:this.accessLevel}}));
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

  clearForm() {
      this.formReset = true;
      this.candidateForm.reset();
  }
}
