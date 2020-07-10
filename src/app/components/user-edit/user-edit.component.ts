import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appConfig } from './../../model/appConfig';
import { browserRefresh } from '../../app.component';
import { SpecialUser } from './../../model/specialUser';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  error = '';
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

  status: String = "";
  createdBy: String = "";
  CreatedDate: Date ;
  UpdatedBy: String = "";
  userLoggedin: String = "";
  email: String = "";
  
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
  ) {
    
    this.password = appConfig.defaultPassword;
    this.quizNumber = 1;
    //this.mainForm();
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

    this.mainForm();
    let user_id = this.actRoute.snapshot.paramMap.get('docid');
    this.getUser(user_id);
    this.editForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      userrole: ['', [Validators.required]],
    })


    
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
    this.editForm.setValue({
      employeeName: data['name'],
      email: data['username'],
      userrole: data['accessLevel']
    });
    this.email = data['username'];
    this.password = data['password'];
    this.quizNumber = data['quizNumber'];
    this.status = data['status'];
    this.createdBy = data['createdBy'];
    this.CreatedDate = data['CreatedDate'];
    this.UpdatedBy = data['UpdatedBy'];
    //this.UpdatedDate
    this.userLoggedin=data['userLoggedin'];
  });


}


onSubmit() {
  this.submitted = true; 
  // Encrypt the password


  let updatedUser = new SpecialUser(this.editForm.value.email,
    this.password,
    this.quizNumber,
    this.status,
    this.editForm.value.userrole,
    this.createdBy,
    this.CreatedDate,
    this.UpdatedBy,
    new Date(),
    new Date(),
    this.userLoggedin,
    this.editForm.value.employeeName
    );

    let user_id = this.actRoute.snapshot.paramMap.get('docid');


   this.currDate = new Date();
   
  if (!this.editForm.valid) {
    return false;
  } else  {
      this.apiService.findUniqueUserEmail(this.editForm.value.email).subscribe(
        (res) => {
         if ((res.count > 1 && this.editForm.value.email == this.email) || (res.count > 0 && this.editForm.value.email != this.email))
         {
            window.confirm("Please use another Email ID");
          } 
          else 
          { this.apiService.updateUserDetails(user_id, updatedUser).subscribe(
            (res) => {
                        console.log('User successfully updated!')
                        alert('User successfully updated!');
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                        this.router.navigate(['/adminuser-create']));
                     }, (error) => {
                        console.log(error);
                     });
            
          }    
        }, (error) => {
    console.log(error);
  }
)
}

}


}
