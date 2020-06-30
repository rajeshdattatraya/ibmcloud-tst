import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { browserRefresh } from '../../app.component';
import { SpecialUser } from './../../model/SpecialUser';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  public browserRefresh: boolean;
  submitted = false;
  editForm: FormGroup;
  JRSS:any = []
  Band:any = [];
  quizNumber: number;
  userName: String = "admin";
  password: String = "";
  currDate: Date ;
  technologyStream:any= [];
  skillArray:any= [];  
  Userrole:any = [];
  userrole: String = "";
  AdminUsers:any = [];
  username;
  index;
  user:SpecialUser;
  
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
  ) {
    
    this.password = appConfig.defaultPassword;
    this.quizNumber = 1;
    this.mainForm();
    this.readUserrole();    
    this.getAllSpecialUsers();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
        if (window.confirm('Your account will be deactivated. You need to contact administrator to login again. Are you sure?')) {
           this.router.navigate(['/login-component']);
        }
    }

    let user_id = this.actRoute.snapshot.paramMap.get('docid');
    this.getUser(user_id);


    
  }

  mainForm() {
    this.editForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      userrole: ['', [Validators.required]],
    })
  }

    // Get all userroles
    readUserrole(){
      this.apiService.getUserroles().subscribe((data) => {
      this.Userrole = data;
      })
   }

   // Choose userrole with select dropdown
   updateUserroleProfile(e){
    this.editForm.get('userrole').setValue(e, {
    onlySelf: true
    })
  }

  // Getter to access form control
  get myForm(){
    return this.editForm.controls;
  }

  //get All special users (e.g. sme, partner etc)
  getAllSpecialUsers(){
    this.apiService.findAllUser().subscribe((data) => {
    this.AdminUsers = data;
    })
}

canExit(): boolean{
  if (this.editForm.dirty && !this.submitted){
    if(window.confirm("You have unsaved data in the Create Candidate form. Please confirm if you still want to proceed to new page")){
      return true;
    } else {
    return false;
    }
  } else {
    return true;
  }
}

getUser(id) {
  this.apiService.getUser(id).subscribe(data => {
    alert('data[name] ====='+data['name']);
    alert('data[username] ====='+data['username']);
    alert('data[acessLevel] ====='+data['accessLevel']);



    this.editForm.setValue({
      employeeName: data['name'],
      email: data['username'],
      userrole: data['acessLevel']
    });
    alert('this.editForm.value.employeeName===='+this.editForm.value.employeeName);
    alert('this.editForm.value.email===='+this.editForm.value.email);
    alert('this.editForm.value.userrole===='+this.editForm.value.userrole);
  });


}


onSubmit() {
  this.submitted = true; 
  // Encrypt the password


  let updatedUser = new SpecialUser(this.editForm.value.email,
    this.user.password,
    this.user.quizNumber,
    this.user.status,
    this.user.accessLevel,
    this.user.createdBy,
    this.user.CreatedDate,
    this.username,
    new Date(),
    this.editForm.value.dateOfJoining,
    this.user.userLoggedin,
    this.editForm.value.employeeName
    );


   this.currDate = new Date();
   
  if (!this.editForm.valid) {
    return false;
  } else  {
      console.log("in candidate-create.ts");
      this.apiService.findUniqueUserEmail(this.editForm.value.email).subscribe(
        (res) => {
          console.log('res.count inside response ' + res.count)
         if (res.count > 0)
         {
            console.log('res.count inside if ' + res.count)
            window.confirm("Please use another Email ID");
          } 
          else 
          {
          if (res.count == 0)
          { this.apiService.createUserDetails(updatedUser).subscribe(
            (res) => {
                        console.log('User successfully created!')
                        alert('User successfully created!');
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['/adminuser-create']));
                     }, (error) => {
                        console.log(error);
                     });
            
          }}        
        }, (error) => {
    console.log(error);
  }
)
}

}


}
