import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: ['./stream-create.component.css']
})
export class StreamCreateComponent implements OnInit {
  public duplicateTechStream : boolean;
  error = '';
  public browserRefresh: boolean;
  streamCreateForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  submitted = false;
  optionsArray:Array<Object>=[];
  jrssDocId: String = "";
  currentJrssArray:any = [];
  techStreamArray:any = [];
  existingTechnologyStream:any = [];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,

  ) { 

    this.mainForm();
    this.readJrss();
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
    this.streamCreateForm = this.fb.group({
      JRSS: ['', [Validators.required]],
      technologyStream :['', [Validators.required]]
    })
  }


   // Get all Jrss
   readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
    this.JRSS = data;
    })
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
      //alert('this.currentJrssArray==='+this.currentJrssArray.technologyStream[0].key);
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
