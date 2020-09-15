import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { User } from './../../model/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit {
  error = '';
  public duplicateAccount : boolean;
  public nullAccount : boolean;
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  accountForm: FormGroup;
  accountList:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  config: any;

  loading = true;
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['Action','account'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.mainForm();
  }

ngOnInit() { 
  this.browserRefresh = browserRefresh;
  this.readAccount();
 }

 ngAfterViewInit(): void {
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
 }

readAccount(){
    this.apiService.getAccounts().subscribe((data) => {
      this.accountList = data;
      this.dataSource.data = data as User[];
    })
  }

mainForm() {
  this.accountForm = this.fb.group({
    account: ['', [Validators.required]]
  })
}

  // Getter to access form control
  get myForm(){
    return this.accountForm.controls;
  }

  pageChange(newPage: number) {
        this.router.navigate(['/account-create'], { queryParams: { page: newPage } });
  }  

  // Check duplicate accounts in Account table
  checkDuplicateAccount(){
    for (var acc of this.accountList){      
      if(acc.account.toLowerCase().trim() == this.accountForm.value.account.toLowerCase().trim()        
      ) {
        this.duplicateAccount = true;
      } else if (this.accountForm.value.account.toLowerCase().trim() === 'null'
            || this.accountForm.value.account.trim().length == 0) {
        this.nullAccount = true;
      }
    }
  }	

  onSubmit() {
      this.submitted = true;
      this.formReset = false;
      this.duplicateAccount = false;
      this.nullAccount = false;
      this.checkDuplicateAccount();
      
      if (!this.accountForm.valid) {
        return false;
      } else if (this.nullAccount){        
        this.error = 'Invalid entries found - Null/Space not allowed!';
      } else if(this.duplicateAccount){        
        this.error = 'Invalid entries found - Account already exist!';
      } else{         
          this.apiService.createAccount(this.accountForm.value).subscribe(
          (res) => {
            console.log('Account successfully saved!')
           this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
           this.router.navigate(['/account-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
          }, (error) => {
            console.log(error);
          });
      }
    }

  clearForm() {
      this.formReset = true;
      this.accountForm.reset();
  }
}
