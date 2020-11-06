import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: ['./stream-create.component.css']
})
export class StreamCreateComponent implements OnInit {
  public duplicateTechStream : boolean;
  error = '';
  config: any;
  public browserRefresh: boolean;
  streamCreateForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;
  submitted = false;
  jrssDocId: String = "";
  currentJrssArray:any = [];
  techStreamArray:any = [];
  existingTechnologyStream:any = [];  
  jrssId;
  jrssName;
  jrssObject: any= [];
  jrssObjectArray:any = [];  
  techStreamCollection:any = [];  
  dataSource = new MatTableDataSource<JRSS>();
  displayedColumns = ['Action','jrss', 'technologyStream'];
  displayedColumnsWithAccount = ['Action','jrss', 'technologyStream', 'account'];
  formReset = false;
  questionsmappedtotechstream = false;
  displayMessage:boolean;
  AccountList:any=[];
  jrssAccountData:any=[];
  accounts:any=[];
  streamFlag:boolean = false;
  filteredJRSS:any=[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { 
    this.config = {
      currentPage: appConfig.currentPage,
      itemsPerPage: appConfig.itemsPerPage,
      totalItems:appConfig.totalItems
    };
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;

        this.accounts = this.account.split(",");
    }
    route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
    this.mainForm();
    this.readJrss();
    this.readTechStream();
  }
  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'jrss': return item[1];
        case 'technologyStream': return item[2];
        case 'account': return item[3];
        default: return item[property];
      }
   };
  }
  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  mainForm() {
    this.streamCreateForm = this.fb.group({
      JRSS: ['', [Validators.required]],
      technologyStream :['', [Validators.required]],
      account :['', [Validators.required]],
      existingTechnologyStream: ['']
    })
  }
   // Get all Jrss
   readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
    this.JRSS = data;
    this.filteredJRSS = data;
    //Remove duplicate entries from the array[]
    this.filteredJRSS = Array.from(this.filteredJRSS.reduce((m, t) => m.set(t.jrss, t), new Map()).values());

    if(this.AccountList == 0){
      this.displayMessage  = true;
      this.filteredJRSS.length = 0;
    }

    // Get technologyStream from JRSS
    for (var jrss of this.JRSS) {     
        this.techStreamArray = [];
        for (var skill of jrss.technologyStream){          
          this.techStreamArray.push(skill.value);  
        }   

        let accountExists =  false;
        for (var i = 0; i < this.accounts.length; i++) {
          if ( jrss.account.toLowerCase().indexOf(this.accounts[i].toLowerCase()) == -1) {
           console.log("Account existance");
          } else {
            accountExists =  true;
            break;
          }
        }

        if (accountExists == true) {
          this.jrssObject = [jrss._id,jrss.jrss, this.techStreamArray, jrss.account];
          this.jrssObjectArray.push(this.jrssObject);
        }
    }  
    this.dataSource.data=this.jrssObjectArray as JRSS[];
    });
  }
  // Get all TechStream
  readTechStream(){
    this.apiService.getTechStream().subscribe((data) => {
    this.techStreamCollection = data;    
    });        
  }
onSelectionChange(jrssId,jrssName) {
  this.jrssId = jrssId;
  this.jrssName = jrssName; 
}
 deleteTechStream() {
    if (this.jrssId == undefined) {
      alert("Please select the technology stream record.");
    } else {
      // Check for job role stream
      this.apiService.getJrssById(this.jrssId).subscribe(data => { 
        this.jrssAccountData = data;
        for (var streams of this.jrssAccountData.technologyStream){             
            this.streamFlag = true;        
        }
        if (this.streamFlag) {
          this.router.navigate(['/delete-stream/', this.jrssId], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
        } else {
          alert("You can't perform this action as there is no technology stream mapped for selected job role.");
        }        
      });      
    }
 }
pageChange(newPage: number) {
  this.router.navigate(['/stream-create'], { queryParams: { page: newPage } });
}
  // Choose designation with select dropdown
  updateJrssProfile(e){
    this.streamCreateForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    // Get technologyStream from JRSS
    for (var jrss of this.JRSS){
      if(jrss.jrss == e){
        this.existingTechnologyStream = [];
        for (var skill of jrss.technologyStream){
          this.existingTechnologyStream.push(skill);
        }
      }
    }    
  }

//List JRSS by account  
listJrssByAccount(accountValue){

  //this.JRSS
  }


  readJrssByAccount(accountValue){
    this.apiService.getJrsssByAccount(accountValue).subscribe((data) => {
    this.JRSS = data;
    this.filteredJRSS = data;
    this.displayMessage = false;
    // Get technologyStream from JRSS
    for (var jrss of this.filteredJRSS){
        this.techStreamArray = [];
        for (var skill of jrss.technologyStream){          
          this.techStreamArray.push(skill.value);        
        }
    }  
    });
  }
  

   // Choose designation with select dropdown 
   updateStreamProfile(e){
    this.streamCreateForm.get('technologyStream').setValue(e, {
      onlySelf: true
    })
  }
  // Getter to access form control
  get myForm(){
    return this.streamCreateForm.controls;
  }
  readJrssDocId(){
    for (var jrss of this.JRSS){
      if(jrss.jrss == this.streamCreateForm.value.JRSS){
        this.jrssDocId = jrss._id;
        this.currentJrssArray = jrss;
        for(var techStream of this.currentJrssArray.technologyStream){
          if(techStream.value.toLowerCase() == this.streamCreateForm.value.technologyStream.toLowerCase()){
            this.duplicateTechStream = true;
          }
        }
      }
    }
  }
  checkforquestions(){   
    this.apiService.checkForQuestions(this.streamCreateForm.value.technologyStream,this.streamCreateForm.value.account).subscribe(res => {
      console.log('Technology stream and Account has question(s) as the count is '+res.count);     
      if(res.count==0)  
      {
        this.questionsmappedtotechstream = false;
        alert('The technology stream '+this.streamCreateForm.value.technologyStream+' should have atleast one question mapped to it before being mapped to a job role!');
      }
      else if(res.count>0)
      {
        this.questionsmappedtotechstream = true;
        this.currentJrssArray.technologyStream.push({key:this.streamCreateForm.value.technologyStream, value:this.streamCreateForm.value.technologyStream});
        this.currentJrssArray.account= this.streamCreateForm.value.account;
        this.apiService.updateTechStream(this.jrssDocId, JSON.stringify(this.currentJrssArray)).subscribe(res => {
          console.log('Technology stream updated successfully!');
          alert('Technology Stream added successfully');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
              this.router.navigate(['/stream-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
          }, (error) => {
          console.log(error);
        })
      }
       }, (error) => {
      console.log(error);
      })
  }
  onSubmit() {
    this.submitted = true;
    this.formReset = false;
    this.duplicateTechStream = false;
    this.readJrssDocId();
    //this.checkforquestions();
    if (!this.streamCreateForm.valid) {
     
      return false;
    } else if(this.duplicateTechStream){
      
      this.error = 'This entry is already existing';
    } else {

      this.checkforquestions();
    }
    
  }
  clearForm() {
    this.formReset = true;
    this.displayMessage  = true;
    this.filteredJRSS.length = 0;
    this.streamCreateForm.reset();
  }
}
