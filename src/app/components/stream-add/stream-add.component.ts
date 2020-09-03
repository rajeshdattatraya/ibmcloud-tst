import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { TechStream } from './../../model/techStream';

@Component({
  selector: 'app-stream-add',
  templateUrl: './stream-add.component.html',
  styleUrls: ['./stream-add.component.css']
})
export class StreamAddComponent implements OnInit {
  error = '';
  public duplicateStream : boolean;
  public nullStream : boolean;
  public browserRefresh: boolean;
  submitted = false;
  streamForm: FormGroup;
  techStreamArray:any = [];
  userName: String = "admin";
  account: any;
  accessLevel:any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.readTechStream();
    this.mainForm();
  }

ngOnInit() { 
  this.browserRefresh = browserRefresh;      
 }

//Cancel
cancelForm(){
  this.ngZone.run(() => this.router.navigateByUrl('/stream-create',{state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}))
}

// Read data from techStream table
 readTechStream(){
  this.apiService.getTechStream().subscribe((data) => {
   this.techStreamArray = data;
  })
}

mainForm() {
this.streamForm = this.fb.group({
  technologyStream: ['', [Validators.required]]
})
}

// Getter to access form control
get myForm(){
  return this.streamForm.controls;
}

// Check duplicate stream in techStream
checkDuplicateStream(){
  for (var stream of this.techStreamArray){
    if(stream.technologyStream.toLowerCase().trim() == this.streamForm.value.technologyStream.toLowerCase().trim()
      || stream.technologyStream.toLowerCase().replace(/\s/g, "").replaceAll("-", "").trim() == this.streamForm.value.technologyStream.toLowerCase().replace(/\s/g, "").replaceAll("-", "").trim()
      || stream.technologyStream.toLowerCase().replace(/\s/g, "").trim() == this.streamForm.value.technologyStream.toLowerCase().replace(/\s/g, "").trim()      
    ) {
      this.duplicateStream = true;
    } else if (this.streamForm.value.technologyStream.toLowerCase().trim() === 'null'
          || this.streamForm.value.technologyStream.trim().length == 0) {
      this.nullStream = true;
    }
  }
}	

onSubmit() {
  this.submitted = true;
  this.duplicateStream = false;
  this.nullStream = false;
  this.checkDuplicateStream();
  let techStreamObject = new TechStream(this.streamForm.value.technologyStream.trim(),this.userName, new Date());
  
  if (!this.streamForm.valid) {
      return false;
  } else if(this.nullStream){
      this.error = 'Invalid entries found - Null/Space not allowed!';
  } else if (this.duplicateStream) {
      this.error = 'Invalid entries found - Technology Stream already exist!';
  } else {    
      this.apiService.createTechStream(techStreamObject).subscribe(
        (res) => {
            console.log('New Technology Stream added successfully!');
            alert('New Technology Stream added successfully!');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/stream-create'], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}}));
        }, (error) => {
            console.log(error);
      });
  }
}
}
