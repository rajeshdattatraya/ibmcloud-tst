import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';

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

    route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );

    this.mainForm();
    this.readJrss();
    this.readTechStream();
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
  }

  mainForm() {
    this.streamCreateForm = this.fb.group({
      JRSS: ['', [Validators.required]],
      technologyStream :['', [Validators.required]],
      existingTechnologyStream: ['']
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
        this.jrssObject = [jrss._id, jrss.jrss, this.techStreamArray];
        this.jrssObjectArray.push(this.jrssObject);          
    }  
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
      alert("Please select the technology stream record");
    } else {
      this.router.navigate(['/delete-stream/', this.jrssId]);
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

  onSubmit() {
    this.submitted = true;
    this.duplicateTechStream = false;
    this.readJrssDocId();
    if (!this.streamCreateForm.valid) {
      return false;
    } else if(this.duplicateTechStream){
      this.error = 'This entry is already existing';
    }else{      
      this.currentJrssArray.technologyStream.push({key:this.streamCreateForm.value.technologyStream, value:this.streamCreateForm.value.technologyStream});
      this.apiService.updateTechStream(this.jrssDocId, JSON.stringify(this.currentJrssArray)).subscribe(res => {
        console.log('Technology stream updated successfully!');
        alert('Technology Stream added successfully');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
             this.router.navigate(['/stream-create']));
        }, (error) => {
        console.log(error);
        })
      }
}
}
