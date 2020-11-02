import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

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
  technologyStream:any= [];
  jrssDocId: String = "";
  jrssId = '';  
  currentJrssArray:any = [];
  jrssAccountData:any=[];
  jobRole: any;
  techStream: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute   
  ) { 
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.mainForm();
    this.readJrss();      
    this.jrssId = this.actRoute.snapshot.paramMap.get('id');      
    this.getJrss(this.jrssId);    
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
          if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
             this.router.navigate(['/login-component']);
          }
      }
  } 

  mainForm() {
    this.streamDeleteForm = this.fb.group({
      jobRole: ['', [Validators.required]],
      techStream :['', [Validators.required]]
    })
  }

  // Get all Jrss
  readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
    this.JRSS = data;    
    })
  }
  
  getJrss(id) {   
    this.apiService.getJrssById(id).subscribe(data => {  
      this.jrssAccountData = data;        
      this.streamDeleteForm.setValue({
        jobRole: data['jrss'],
        techStream: ''        
      }); 

      // Get technologyStream from JRSS        
      this.technologyStream = [];
        for (var skill of this.jrssAccountData.technologyStream){
            this.technologyStream.push(skill);           
        }
    });
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
      this.jrssDocId = this.jrssAccountData._id;
      this.currentJrssArray = this.jrssAccountData;  
}

onSubmit() {
    this.submitted = true;
    this.readJrssDocId();    
    if (!this.streamDeleteForm.valid) {
      return false;
    } else {      
      this.currentJrssArray.technologyStream = this.currentJrssArray.technologyStream.filter(item => item.key !== this.streamDeleteForm.value.techStream);       
      this.apiService.updateTechStream(this.jrssDocId, JSON.stringify(this.currentJrssArray)).subscribe(res => {
            console.log('Technology Stream deleted successfully!');
            alert('Technology Stream deleted successfully!');        
            this.ngZone.run(() => this.router.navigateByUrl('/stream-create',{state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
        }, (error) => {
            console.log(error);
        })
      }
  }
}
