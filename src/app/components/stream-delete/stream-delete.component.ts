import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';
import {appConfig} from './../../model/appConfig';

@Component({
  selector: 'app-stream-delete',
  templateUrl: './stream-delete.component.html',
  styleUrls: ['./stream-delete.component.css']
})
export class StreamDeleteComponent implements OnInit {  
  error = '';
  config: any;
  public browserRefresh: boolean;
  streamDeleteForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  account: any;
  accessLevel: any;
  submitted = false;
  techStreamArray:any = [];
  technologyStream:any= [];
  jrssObject: any= [];
  jrssObjectArray:any = [];  
  jrssDocId: String = "";
  jrssId = '';  
  currentJrssArray:any = [];
  dataSource = new MatTableDataSource<JRSS>();
  displayedColumns = ['Action','jrss', 'technologyStream'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute   
  ) { 
    this.config = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems:0
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    actRoute.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
          if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
             this.router.navigate(['/login-component']);
          }
      } 
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'jrss': return item[1];
          case 'technologyStream': return item[2];
          default: return item[property];
        }
     };

      this.mainForm();
      this.readJrss();      
      this.jrssId = this.actRoute.snapshot.paramMap.get('id');      
      this.getJrss(this.jrssId);     
      this.streamDeleteForm = this.fb.group({
        JRSS: ['', [Validators.required]],
        technologyStream :['', [Validators.required]]
      })
  } 

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  mainForm() {
    this.streamDeleteForm = this.fb.group({
      JRSS: ['', [Validators.required]],
      technologyStream :['', [Validators.required]]
    })
  }

  // Get all Jrss
  readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
    this.JRSS = data;  
        
    // Get technologyStream from JRSS
    for (var jrss of this.JRSS){     
      this.techStreamArray = [];
        for (var skill of jrss.technologyStream){          
            this.techStreamArray.push(skill.value);         
        }        
        this.jrssObject = [jrss.jrss, this.techStreamArray];
        this.jrssObjectArray.push(this.jrssObject);  
        this.dataSource.data=this.jrssObjectArray as JRSS[];  
    } 
    })
  }

  
  getJrss(id) {     
    this.apiService.getJrssById(id).subscribe(data => {        
      this.streamDeleteForm.setValue({
        JRSS: data['jrss'],
        technologyStream: data['technologyStream']        
      }); 

      // Get technologyStream from JRSS
      for (var jrss of this.JRSS){
        if(jrss.jrss == data['jrss']){
          this.technologyStream = [];
          for (var skill of jrss.technologyStream){
            this.technologyStream.push(skill);
          }
        }
      }    
      
    });
  }

  /** this method is to print the serial numners on all the pagination pages */
  currentPages=appConfig.currentPage;
  pageSize=appConfig.itemsPerPage;
  public handlePage(e: any) {
    this.currentPages = e.pageIndex;
    this.pageSize = e.pageSize;
  }
  //End of Pagination serial number method

pageChange(newPage: number) {
  this.router.navigate(['/delete-stream',this.jrssId], { queryParams: { page: newPage } });
}

  // Choose designation with select dropdown
  updateJrssProfile(e){
    this.streamDeleteForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    // Get technologyStream from JRSS
    for (var jrss of this.JRSS){          
      if(jrss.jrss == e){
        this.currentJrssArray = jrss;
        this.technologyStream = [];
        for (var skill of jrss.technologyStream){          
          this.technologyStream.push(skill);
        } 
      }
    }    
  } 

  updateStreamProfile(e){
    this.streamDeleteForm.get('technologyStream').setValue(e, {
      onlySelf: true
    })
  }
  
  // Getter to access form control
  get myForm(){
    return this.streamDeleteForm.controls;
  }

  canExit(): boolean{
    if (this.streamDeleteForm.dirty && !this.submitted){
      if(window.confirm("You have un-deleted data in the technology form. Please confirm if you still want to proceed to new page")){
        return true;
      } else {
      return false;
      }
    } else {
      return true;
    }
  }

//Cancel
cancelForm(){
  this.ngZone.run(() => this.router.navigateByUrl('/stream-create',{state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
}

readJrssDocId(){
  for (var jrss of this.JRSS){    
    if(jrss.jrss == this.streamDeleteForm.value.JRSS){
      this.jrssDocId = jrss._id;
      this.currentJrssArray = jrss;      
    }
  }
}

onSubmit() {
    this.submitted = true;
    this.readJrssDocId();    
    if (!this.streamDeleteForm.valid) {
      return false;
    } else{   
      this.currentJrssArray.technologyStream = this.currentJrssArray.technologyStream.filter(item => item.key !== this.streamDeleteForm.value.technologyStream);
      this.apiService.updateTechStream(this.jrssDocId, JSON.stringify(this.currentJrssArray)).subscribe(res => {
        console.log('Technology Stream deleted successfully!');
        alert('Technology Stream deleted successfully!');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
             this.router.navigate(['/delete-stream/',this.jrssId], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
        }, (error) => {
        console.log(error);
        })
      }
}

}
