import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-stream-delete',
  templateUrl: './stream-delete.component.html',
  styleUrls: ['./stream-delete.component.css']
})
export class StreamDeleteComponent implements OnInit {  
  public duplicateTechStream : boolean;
  error = '';
  public browserRefresh: boolean;
  streamDeleteForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  submitted = false;
  optionsArray:Array<Object>=[];
  jrssDocId: String = "";
  currentJrssArray:any = [];
  techStreamArray:any = [];
  existingTechnologyStream:any = [];
  config: any;
  index;  
  jrssId;
  jrssValue;
  technologyStream:any= [];
  skillArray:any= []; 
  stream:any=[];
  jrssStream : JRSS;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute   
  ) { 
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
          if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
             this.router.navigate(['/login-component']);
          }
      } 
      this.mainForm();
      this.readJrss();      
      let jrss_id = this.actRoute.snapshot.paramMap.get('id');      
      this.getJrss(jrss_id);     
      this.streamDeleteForm = this.fb.group({
        JRSS: ['', [Validators.required]],
        technologyStream :['', [Validators.required]]
      })

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
    })
  }

  
  getJrss(id) {   
    this.apiService.getJrssById(id).subscribe(data => {        
      this.streamDeleteForm.setValue({
        JRSS: data['jrss'],
        technologyStream: data['technologyStream']        
      }); 

      // Get technologyStream from JRSS
     // this.stream = this.streamDeleteForm.value.technologyStream.split(",");
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

pageChange(newPage: number) {
  this.router.navigate(['/delete-stream'], { queryParams: { page: newPage } });
}

  // Choose designation with select dropdown
  updateJrssProfile(e){
    this.streamDeleteForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
    // Get technologyStream from JRSS
    for (var jrss of this.JRSS){          
      if(jrss.jrss == e){
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
      if(window.confirm("You have undeleted data in the delete technology form. Please confirm if you still want to proceed to new page")){
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
  this.ngZone.run(() => this.router.navigateByUrl('/stream-create',{state:{username:this.userName}}))
}

onSubmit() {
    this.submitted = true;
    
    if (!this.streamDeleteForm.valid) {
      return false;
    } else{ 

      // To-Do -- Delete stream from JRSS technology Stream arry
      console.log("Tech="+ this.streamDeleteForm.value.technologyStream);
       
      }
}

}
