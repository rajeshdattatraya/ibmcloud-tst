import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { JRSS } from './../../model/jrss';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';
import { timeout } from 'rxjs/operators';
import {appConfig} from './../../model/appConfig';

@Component({
  selector: 'app-jrss-edit',
  templateUrl: './jrss-edit.component.html',
  styleUrls: ['./jrss-edit.component.css']
})
export class JrssEditComponent implements OnInit {
  error = '';
  public duplicateJrss : boolean;
  public nullJrss : boolean;
  public browserRefresh: boolean;
  submitted = false;

  jrssForm: FormGroup;
  Jrss:any = [];
  filteredJrss:any = [];
  userName: String = "admin";
  jrssID: String = '';
  index: any;
  account: any;
  accessLevel:any;
  config: any;
  accounts:any=[];
  constructor(
      public fb: FormBuilder,
      private router: Router,
      private actRoute: ActivatedRoute,
      private ngZone: NgZone,
      private apiService: ApiService
    ) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.accounts = this.account.split(",");
      }
      this.mainForm();
    }

  ngOnInit() { 
    this.browserRefresh = browserRefresh;
    this.jrssID = this.actRoute.snapshot.paramMap.get('id');
    this.getJrss(this.jrssID);
   }

  getJrss(id) {
    this.apiService.getJrssById(id).subscribe(data => {
      this.jrssForm.setValue({
        jrss: data['jrss'],
        account: data['account']
      });
    });
  }


  mainForm() {
    this.jrssForm = this.fb.group({
      jrss: ['', [Validators.required]],
      account: ['', [Validators.required]],
    })
  }

    // Getter to access form control
    get myForm(){
      return this.jrssForm.controls;
    }

  // Check duplicate Jrss in the table
  checkDuplicateJrss(){
    for (var jrss of this.filteredJrss){
      if(jrss.jrss.toLowerCase().trim() == this.jrssForm.value.jrss.toLowerCase().trim()
      && jrss.account.toLowerCase().trim() == this.jrssForm.value.account.toLowerCase().trim()
      ) {
        this.duplicateJrss = true;
      } else if (this.jrssForm.value.jrss.toLowerCase().trim() === 'null'
            || this.jrssForm.value.jrss.trim().length == 0
            || this.jrssForm.value.jrss == "") {
        this.nullJrss = true;
      }
    }
  }	

    onSubmit() {
        this.submitted = true;
        this.duplicateJrss = false;
        this.nullJrss = false;
        this.checkDuplicateJrss();

        if (!this.jrssForm.valid) {
          return false;
        } else if (this.nullJrss){
          this.error = 'Invalid entries found - Null/Space not allowed!';
        } else if(this.duplicateJrss){
          this.error = 'Invalid entries found - Job Role already exist!';
        } else{   
            this.apiService.updateJrss(this.jrssID,this.jrssForm.value).subscribe(
              (res) => {
              console.log('Job Role name successfully updated!')
              alert("Job Role is updated successfully.");
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/jrss-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
              }, (error) => {
                console.log(error);
            });
        }
      }

    cancelForm() {
        this.router.navigate(['/jrss-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
    }

}
