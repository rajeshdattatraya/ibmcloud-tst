import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { JRSS } from './../../model/jrss';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-stream-delete',
  templateUrl: './stream-delete.component.html',
  styleUrls: ['./stream-delete.component.css']
})
export class StreamDeleteComponent implements OnInit {  
  error = '';
  public browserRefresh: boolean;
  streamDeleteForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  submitted = false;

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
    this.streamDeleteForm = this.fb.group({
      technologyStream :['', [Validators.required]]
    })
  }
  // Get all Jrss
  readJrss(){
    this.apiService.getJRSS().subscribe((data) => {
    this.JRSS = data;
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
