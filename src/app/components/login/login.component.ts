import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './../../service/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import * as CryptoJS from 'crypto-js';
import { TestConfigService } from './../../service/testconfig.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  public browserRefresh: boolean;
  loginMessage = false
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  forgotSubmitted = false;
  returnUrl: string;
  error = '';
  private currentUserSubject: BehaviorSubject<LoginComponent>;
  public currentUser: Observable<LoginComponent>;
  mode = 'login';
  encryptedPassword: String = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private testconfigService: TestConfigService,
    private apiService: ApiService,
    private ngZone: NgZone,


  ) {

    this.currentUserSubject = new BehaviorSubject<LoginComponent>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']
    //     );
    // }
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.loginMessage = true
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.forgotPasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
      Dateofjoining: ['', Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  //convenience getter for easy access to form fields
  get f1() { return this.loginForm.controls; }


  get forgotPwd() {
    return this.forgotPasswordForm.controls;
  }

  forgotPassword() {
    this.mode = 'forgotPassword'
  }

  onforgotPasswordSubmit() {
    this.forgotSubmitted = true;
    if (!this.forgotPasswordForm.valid) { return false; } else {
      this.apiService.getUserByIdAndDOJ(this.forgotPasswordForm.value.username, this.forgotPasswordForm.value.Dateofjoining).subscribe(
        (res) => {
          this.ngZone.run(() => this.router.navigateByUrl('/change-password', { state: { username: res.username, quizNumber: res.quiznumber } }))
        }, (error) => {
          this.error = 'Invalid Username/DateOfJoining/DateOfBirth'
          console.log(error);
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    // Encrypt the password 
    var base64Key = CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c");
    var ivMode = CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97");
    this.encryptedPassword = CryptoJS.AES.encrypt(this.loginForm.value.password.trim(), base64Key, { iv: ivMode }).toString();
    this.encryptedPassword = this.encryptedPassword.replace("/", "=rk=");
    console.log("Encrypted val = " + this.encryptedPassword);

    if (!this.loginForm.valid) {
      return false;
    } else {
      this.apiService.getUserByIdAndPwd(this.loginForm.value.username, this.encryptedPassword.trim()).subscribe(
        (res) => {
          console.log('User ' + res.username + ' successfully loggedin!')
          if (res.accessLevel === 'admin') {
            if(res.password == appConfig.defaultEncryptedPassword){
              this.ngZone.run(() => this.router.navigateByUrl('/change-password',{state:{username:res.username,quizNumber:res.quizNumber}}))  
             }else{
            this.ngZone.run(() => this.router.navigateByUrl('/candidates-list', { state: { username: res.username ,accessLevel: res.accessLevel,account:res.account} }))
          }
        } else if (res.accessLevel === 'sme') {
			   if(res.password == appConfig.defaultEncryptedPassword){
                this.ngZone.run(() => this.router.navigateByUrl('/change-password',{state:{username:res.username,quizNumber:res.quizNumber}}))  
               }else{
			   this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list', { state: { username: res.username, accessLevel: res.accessLevel,account:res.account } }))
			   }
          } else if (res.accessLevel === 'partner') {
			  if(res.password == appConfig.defaultEncryptedPassword){
                this.ngZone.run(() => this.router.navigateByUrl('/change-password',{state:{username:res.username,quizNumber:res.quizNumber}}))  
               }else{
            this.ngZone.run(() => this.router.navigateByUrl('/partner-list', { state: { username: res.username, accessLevel: res.accessLevel, account:res.account } }))
			   }
          } else if (res.accessLevel === 'management') {
			  if(res.password == appConfig.defaultEncryptedPassword){
                this.ngZone.run(() => this.router.navigateByUrl('/change-password',{state:{username:res.username,quizNumber:res.quizNumber}}))  
               }else{
            this.ngZone.run(() => this.router.navigateByUrl('/openpositions-list', { state: { username: res.username, accessLevel: res.accessLevel, account:res.account } }))
			   }
          } else if (res.accessLevel === 'superAdmin') {
            if(res.password == appConfig.defaultEncryptedPassword){
                    this.ngZone.run(() => this.router.navigateByUrl('/change-password',{state:{username:res.username,quizNumber:res.quizNumber}}))  
                   }else{
                this.ngZone.run(() => this.router.navigateByUrl('/superadmin-user-create', { state: { username: res.username, accessLevel: res.accessLevel, account:res.account } }))
             }
              } else if (res.userLoggedin == 'false') {
            if (res.quizNumber == 1 && res.status == 'Active' && res.password == appConfig.defaultEncryptedPassword) {
              this.ngZone.run(() => this.router.navigateByUrl('/change-password', { state: { username: res.username, quizNumber: res.quizNumber } }))
            } else {
              if (res.status == 'Active') {
                this.apiService.updateUserLoggedinStatus(res.username, 'true').subscribe(res => {
                  console.log('User Loggedin status updated successfully!');
                }, (error) => {
                  console.log(error);
                }
                );

                this.ngZone.run(() => this.router.navigateByUrl('/quizInstructions', { state: { username: res.username, quizNumber: res.quizNumber, accessLevel: res.accessLevel } }))
              } else {
                let passingScore;
                this.apiService.getResultByUser(res.username, res.quizNumber).subscribe(result => {
                  this.apiService.getCandidateJrss(res.username).subscribe(
                    (resJrss) => {
                      this.testconfigService.findTestConfigByJRSS(resJrss['JRSS'],resJrss['account']).subscribe(
                        (data) => {
                          passingScore = data['passingScore'];
                          if (result['userScore'] >= passingScore && result['stage2_status'] == "Not Started" && (result['stage1_status'] == "Skipped" || result['stage1_status'] == "Completed")) {
                            this.ngZone.run(() => this.router.navigateByUrl('/pre-tech-form', { state: { userName: res.username, mode: 'instructions' } }))
                          }

                          else if (result['stage2_status'] == "Completed") {
                            this.error = 'Our team will contact you regarding your progression to the further rounds.'
                          }
                          else {
                            this.error = 'You are not an active user'
                          }
                        }, (error) => {
                          console.log(error);
                        })
                    }, (error) => {
                      console.log(error);
                    });
                }, (error) => {
                  console.log(error);
                }
                );
              }
            }
          } else if (res.status !== 'Active') { //When user is NOT Active and logged in thendisplay below:
            this.error = 'You are not an active user'
          } else { //When user is Active and logged in then display below:
            this.error = 'You are already logged in from another browser'
          }
        }, (error) => {
          this.error = 'Invalid Credentials'
          console.log(error);

        });
    }
  }

  //Cancel
  cancelForm(){
      this.mode = 'login';
  }

}
