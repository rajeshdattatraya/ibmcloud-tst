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
  filteredJrss:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  config: any;
  accounts:any=[];
  filterObj = {};
  loading = true;
  dataSource = new MatTableDataSource<JRSS>();
  displayedColumns = ['Action','jrss'];
  displayedColumnsWithAccount = ['Action','jrss','account'];

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

          this.accounts = this.account.split(",");
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
  
  /** this method is to print the serial numners on all the pagination pages */
  currentPage=appConfig.currentPage;
  pageSize=appConfig.itemsPerPage;
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
  }
//End of Pagination serial number method

  readJrss(){
      this.apiService.getJrsss().subscribe((data) => {
       this.Jrss = data;
       
       
for (let k=0; k<this.Jrss.length; k++){
       var item = this.Jrss[k].account;
        let accountExists =  false;
        for (var i = 0; i < this.accounts.length; i++) {
         
          if ( item.toLowerCase().indexOf(this.accounts[i].toLowerCase()) == -1) {
           // accountExists =  false;
          } else { accountExists =  true; 
            break; }
        }

        if (accountExists == true) {
          this.filteredJrss.push(this.Jrss[k]);
        }
      }
      this.dataSource.data = this.filteredJrss as JRSS[];

      })
      
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
              alert("Job Role is created successfully.");
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
