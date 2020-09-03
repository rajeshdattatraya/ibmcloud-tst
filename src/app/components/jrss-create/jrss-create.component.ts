import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { JRSS } from './../../model/jrss';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-jrss-create',
  templateUrl: './jrss-create.component.html',
  styleUrls: ['./jrss-create.component.css']
})
export class JrssCreateComponent implements OnInit {
  error = '';
  public duplicateJrss : boolean;
  public nullJrss : boolean;
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  jrssForm: FormGroup;
  Jrss:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  config: any;

  loading = true;
  dataSource = new MatTableDataSource<JRSS>();
  displayedColumns = ['Action','jrss'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      }
      this.mainForm();
    }

  ngOnInit() { 
    this.browserRefresh = browserRefresh;
    this.readJrss();
   }

   ngAfterViewInit(): void {
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
   }

  getJrss(id) {
    this.apiService.getJrss(id).subscribe(data => {
      this.jrssForm.setValue({
        jrss: data['jrss']
      });
    });
  }

  readJrss(){
      this.apiService.getJrsss().subscribe((data) => {
       this.Jrss = data;
       this.dataSource.data = data as JRSS[];
      })
    }

  mainForm() {
    this.jrssForm = this.fb.group({
      jrss: ['', [Validators.required]]
    })
  }

    // Getter to access form control
    get myForm(){
      return this.jrssForm.controls;
    }

    pageChange(newPage: number) {
          this.router.navigate(['/jrss-create'], { queryParams: { page: newPage } });
    }
    
  removeJrss(jrss, index) {
    if(window.confirm('Are you sure?')) {
        this.apiService.deleteJrss(jrss._id).subscribe((data) => {
          this.Jrss.splice(index, 1);
        }
      )
    }
  }

  // checkDuplicateJrss(){
  //   for (var jrss of this.Jrss){
  //     if(jrss.jrss.toLowerCase().trim() == this.jrssForm.value.jrss.toLowerCase().trim()
  //         || this.jrssForm.value.jrss.toLowerCase().trim() === 'null'
  //         || this.jrssForm.value.jrss.trim().length == 0
  //         || this.jrssForm.value.jrss == ""){
  //       this.duplicateJrss = true;
  //     }
  //   }
  // }

  // Check duplicate stream in techStream
  checkDuplicateJrss(){
    for (var jrss of this.Jrss){
      if(jrss.jrss.toLowerCase().trim() == this.jrssForm.value.jrss.toLowerCase().trim()
        || jrss.jrss.toLowerCase().replace(/\s/g, "").replaceAll("-", "").trim() == this.jrssForm.value.jrss.toLowerCase().replace(/\s/g, "").replaceAll("-", "").trim()
        || jrss.jrss.toLowerCase().replace(/\s/g, "").trim() == this.jrssForm.value.jrss.toLowerCase().replace(/\s/g, "").trim()      
      ) {
        this.duplicateJrss = true;
      } else if (this.jrssForm.value.jrss.toLowerCase().trim() === 'null'
            || this.jrssForm.value.jrss.trim().length == 0) {
        this.nullJrss = true;
      }
    }
  }	

    onSubmit() {
        this.submitted = true;
        this.formReset = false;
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
          this.apiService.createJrss(this.jrssForm.value).subscribe(
            (res) => {
              console.log('JRSS successfully saved!')
             this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
             this.router.navigate(['/jrss-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
            }, (error) => {
              console.log(error);
            });
        }
      }

    clearForm() {
        this.formReset = true;
        this.jrssForm.reset();
    }
}
