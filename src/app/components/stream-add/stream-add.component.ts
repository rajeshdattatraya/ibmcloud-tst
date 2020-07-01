import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-stream-add',
  templateUrl: './stream-add.component.html',
  styleUrls: ['./stream-add.component.css']
})
export class StreamAddComponent implements OnInit {
  error = '';
  public duplicateStream : boolean;
  public browserRefresh: boolean;
  submitted = false;
  streamForm: FormGroup;
  techStreamArray:any = [];
  userName: String = "admin"; 

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.readTechStream();
    this.mainForm();
  }

ngOnInit() { 
  this.browserRefresh = browserRefresh;      
 }

//Cancel
cancelForm(){
  this.ngZone.run(() => this.router.navigateByUrl('/stream-create',{state:{username:this.userName}}))
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
    if(stream.technologyStream.toLowerCase() == this.streamForm.value.technologyStream.toLowerCase()){
      this.duplicateStream = true;
    }
  }
}	

onSubmit() {
  this.submitted = true;
  this.duplicateStream = false;
  this.checkDuplicateStream();
  if (!this.streamForm.valid) {
    return false;
  } else if(this.duplicateStream){
    this.error = 'This entry is already existing';
  } else{
    console.log("this.streamForm.value="+this.streamForm.value);
    this.apiService.createTechStream(this.streamForm.value).subscribe(
      (res) => {
        console.log('New Technology Stream added successfully!');
        alert('New Technology Stream added successfully!');
       this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
       this.router.navigate(['/stream-create']));
      }, (error) => {
        console.log(error);
      });
  }
}
}
