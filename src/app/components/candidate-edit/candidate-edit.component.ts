import { Candidate } from './../../model/candidate';
import { UserDetails } from './../../model/userDetails'
import { Component, OnInit,NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from './../../service/api.service';
import { OpenPositionService } from './../../service/openposition.service';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { browserRefresh } from '../../app.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})

export class CandidateEditComponent implements OnInit {
  public browserRefresh: boolean;
  submitted = false;
  formReset = false;
  editForm: FormGroup;
  myOpenPositionGroup: FormGroup;
  JRSS:any = [];
  JRSSFull:any = [];
  Band:any = [];
  candidate : Candidate;
  user : UserDetails;
  username = "";
  changeEmail: Boolean;
  currDate: Date ;
  technologyStream:any= [];
  skillArray:any= []; 
  stream:any=[];
  resumeBlob:Blob;
  resumeName1:string;
  editCandResume:File;
  resumeUploaded:boolean;
  resumeText:any;
  EmployeeType:any = ['Regular','Contractor'];
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  Account:any = [];
  AccountArray:any = [];

  OpenPositions: any = [];
  lineOfBusiness:any;
  positionID:any;
  competencyLevel:any;
  positionLocation:any;
  UserPositionLocation:any = [];
  rateCardJobRole:any;
  OpenPosition: any= [];
  UserLOB: any = [];
  displayGPCalculate: boolean = false;
  account: any;
  accessLevel:any;
  grossProfit: any;
  gpCount: number = 0;
  gp: any;
  displayPositionDetails = false;
  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private ngZone: NgZone,
    private openPositionService: OpenPositionService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.username = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
    this.readJrss();
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.mainOpenForm();
    this.readUserPositionLocation();
    this.readUserLineOfBusiness();
    this.readBand();
    this.readAccount();
    this.updateCandidate();

    let can_id = this.actRoute.snapshot.paramMap.get('id');
    let user_id = this.actRoute.snapshot.paramMap.get('user_id');
    this.getCandidate(can_id);
    this.getUser(user_id);
    this.downloadCandidateResume(can_id);
    this.editForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      employeeType: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      band: [''],
      JRSS: ['', [Validators.required]],
      technologyStream:['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateOfJoining: ['', [Validators.required]],
      account: ['', [Validators.required]],
      userLOB: [''],
      userPositionLocation: ['']
    })
    this.myOpenPositionGroup = this.fb.group({
          positionName: '',
          rateCardJobRole: '',
          lineOfBusiness: '',
          positionID: '',
          positionLocation: '',
          competencyLevel:'',
          grossProfit: '',
          gpUserPositionLocation: '',
          gpUserLOB: '',
          gpUserBand: ''
    })
  }
  // Get all Jrss
 readJrss(){
  this.apiService.getJRSS().subscribe((data) => {
    this.JRSSFull = data;
    for(var i=0; i<this.JRSSFull.length; i++)
    {
      let workFlowPrsent = ( (this.JRSSFull[i]['stage1_OnlineTechAssessment']==undefined) ||
      ((this.JRSSFull[i]['stage1_OnlineTechAssessment']==false) &&
      (this.JRSSFull[i]['stage2_PreTechAssessment']==false) &&
      (this.JRSSFull[i]['stage3_TechAssessment']==false) &&
      (this.JRSSFull[i]['stage4_ManagementInterview']==false) &&
      (this.JRSSFull[i]['stage5_ProjectAllocation']==false)))
      if (!workFlowPrsent){
        this.JRSS.push(this.JRSSFull[i]);
      }
    }

  })
}
  // Choose designation with select dropdown
  updateJrssProfile(e){
    this.editForm.get('JRSS').setValue(e, {
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
    this.getOpenPositionDetails();
  }

  // Choose options with select-dropdown
  updateProfile(e) {
    this.editForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
  }

  // Choose options with select-dropdown
    updateBandProfile(e) {
      this.editForm.get('band').setValue(e, {
        onlySelf: true
      })
      this.myOpenPositionGroup.get('gpUserBand').setValue(e);
      this.gpCount = 0;
    }

  // Choose options with select-dropdown
  updateEmployeeTypeProfile(e) {
    this.editForm.get('employeeType').setValue(e, {
      onlySelf: true
    })

    if (this.editForm.value.employeeType == 'Contractor') {
        this.displayContractorUIFields = true;
        this.displayRegularUIFields = false;
    } else {
       this.displayContractorUIFields = false;
       this.displayRegularUIFields = true;
    }
  }

  // Get all Bands
    readBand(){
       this.apiService.getBands().subscribe((data) => {
       this.Band = data;
       })
    }
     // Choose options with select-dropdown
  updateAccountProfile(e) {
    this.editForm.get('account').setValue(e, {
      onlySelf: true
    })
  }

    // Get all Acconts
    readAccount(){
      this.AccountArray = this.account.split(",");
    }
  // Getter to access form control
  get myForm() {
    return this.editForm.controls;
  }
  // Getter to access form control
  get myOpenForm(){
    return this.myOpenPositionGroup.controls;
  }
 // Get all User Line of business
  readUserLineOfBusiness(){
     this.openPositionService.getLineOfBusiness().subscribe((data) => {
      this.UserLOB = data;
     })
  }

  getCandidate(id) {
    this.apiService.getCandidate(id).subscribe(data => {
      if (data['employeeType'] == undefined) {
          data['employeeType'] = 'Regular'
      }
      if (data['employeeType'] == 'Regular') {
       this.displayContractorUIFields = false;
       this.displayRegularUIFields = true;
       this.stream = data['technologyStream'].split(",");
       this.gp = data['grossProfit'];
        this.editForm.setValue({
          employeeName: data['employeeName'],
          employeeType: data['employeeType'],
          email: data['email'],
          band: data['band'],
          JRSS: data['JRSS'],
          technologyStream: this.stream,
          phoneNumber: data['phoneNumber'],
          dateOfJoining : this.datePipe.transform(data['dateOfJoining'], 'yyyy-MM-dd'),
          account: data['account'],
          userLOB: data['userLOB'],
          userPositionLocation: data['userPositionLocation']
        });
        this.openPositionService.readOpenPositionByPositionName(data['openPositionName']).subscribe((openPositionData) => {
            this.lineOfBusiness = openPositionData['lineOfBusiness'];
            this.competencyLevel = openPositionData['competencyLevel'];
            this.positionLocation = openPositionData['positionLocation'];
            this.rateCardJobRole = openPositionData['rateCardJobRole'];
            this.positionID = openPositionData['positionID'];
            this.myOpenPositionGroup.setValue({
                  positionName: openPositionData['positionName'],
                  positionID: openPositionData['positionID'],
                  rateCardJobRole: openPositionData['rateCardJobRole'],
                  lineOfBusiness: openPositionData['lineOfBusiness'],
                  positionLocation: openPositionData['positionLocation'],
                  competencyLevel : openPositionData['competencyLevel'],
                  gpUserPositionLocation: data['userPositionLocation'],
                  grossProfit: data['grossProfit'],
                  gpUserLOB: data['userLOB'],
                  gpUserBand: data['band']

            });
            this.displayPositionDetails = true;
        }) ;
       }
      if (data['employeeType'] == 'Contractor') {
        this.displayContractorUIFields = true;
        this.displayRegularUIFields = false;
        this.editForm.setValue({
          employeeName: data['employeeName'],
          employeeType: data['employeeType'],
          email: data['email'],
          band: '',
          JRSS: data['JRSS'],
          technologyStream: this.stream,
          phoneNumber: data['phoneNumber'],
          dateOfJoining : this.datePipe.transform(data['dateOfJoining'], 'yyyy-MM-dd'),
          account: data['account'],
          userLOB: '',
          userPositionLocation: ''

        });
        this.myOpenPositionGroup.setValue({
          positionName: '',
          positionID: '',
          rateCardJobRole: '',
          lineOfBusiness: '',
          positionLocation: '',
          competencyLevel:'',
          grossProfit: '',
          gpUserPositionLocation: '',
          gpUserLOB: '',
          gpUserBand:''
        })
      }
      this.technologyStream = [];
      // Get technologyStream from JRSS
      //this.stream = this.editForm.value.technologyStream.split(",");
      for (var jrss of this.JRSS){
        if(jrss.jrss == this.editForm.value.JRSS){
          this.technologyStream = [];
          for (var skill of jrss.technologyStream){
            for(var streamValue of this.stream) {
              if(skill.value == streamValue){
                skill.isSelected = "selected";
              }
            }
            this.technologyStream.push(skill);
          }
        }
      }
      if (data['employeeType'] == 'Regular' || data['employeeType'] == undefined) {
        this.candidate = new Candidate(data['employeeName'],data['employeeType'],
        data['email'], data['band'], data['JRSS'], data['technologyStream'], data[ 'phoneNumber'], data['dateOfJoining'],
        data['createdBy'], data['createdDate'], data['updatedBy'], data['updatedDate'],
        data['username'], data['resumeName'], data['resumeData'], data['account'],
        data['userLOB'],data['grossProfit'],data['userPositionLocation'], data['openPositionName'], data['positionID']);
      }
      if (data['employeeType'] == 'Contractor') {
        this.candidate = new Candidate(data['employeeName'],data['employeeType'],
        data['email'], '', data['JRSS'], data['technologyStream'], data[ 'phoneNumber'], data['dateOfJoining'],
        data['createdBy'], data['createdDate'], data['updatedBy'], data['updatedDate'],
        data['username'], data['resumeName'], data['resumeData'], data['account'],'','','','','');
      }
    });
  }

  downloadCandidateResume(id){
    this.apiService.getCandidate(id).subscribe(data => {
      //Get resume Data
      this.resumeName1 = data['resumeName'];
      let resumeData1 : String = data['resumeData'];
      var byteString = atob(resumeData1.split(',')[1]);
      // separate out the mime component
      var mimeString = resumeData1.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      this.resumeBlob =  new Blob([ab], {type: mimeString});

      if (this.resumeName1 == "ResumeEmpty.doc") {
        this.resumeUploaded=false;
      } else {
        this.resumeUploaded = true;
      }
      });
  }

  downloadResume() {
    saveAs(this.resumeBlob,this.resumeName1);
  }

  getUser(id) {
    this.apiService.getUser(id).subscribe(data => {
      this.user = new UserDetails(
      data['username'],data['password'],data['quizNumber'],
      data['status'], data['acessLevel'],data['createdBy'],
      data['createdDate'],data['updatedBy'], data['updatedDate'],
      data['DateOfJoining'],data['userLoggedin'])
    });
  }

  updateCandidate() {
    this.editForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      employeeType: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,3}$')]],
      band: [''],
      JRSS: ['', [Validators.required]],
      technologyStream: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateOfJoining: ['', [Validators.required]],
      account: [''],
      userLOB: [''],
      userPositionLocation: ['']
      })
  }

  canExit(): boolean{
    if (this.editForm.dirty && !this.submitted){
      if(window.confirm("You have unsaved data in the Update Candidate form. Please confirm if you still want to proceed to new page")){
        return true;
      } else {
      return false;
      }
    } else {
      return true;
    }
  }

  //Add resume
  addResume(event) {
    this.editCandResume= event.target.files[0];
  }

  //submit button
  onSubmit() {
    this.submitted = true;

     // Technology Stream
     if( typeof(this.editForm.value.technologyStream) == 'object' ) {
      this.editForm.value.technologyStream = this.editForm.value.technologyStream.join(',');
     }
     let updatedCandidate;
     if(!this.editCandResume) {
      console.log("Resume is not selected");
      //Candidate details for a regular employee whose resume is not selected
      if (this.editForm.value.employeeType == 'Regular') {
        updatedCandidate = new Candidate(this.editForm.value.employeeName,this.editForm.value.employeeType,
        this.editForm.value.email, this.editForm.value.band, this.editForm.value.JRSS,this.editForm.value.technologyStream,
        this.editForm.value.phoneNumber, this.editForm.value.dateOfJoining,this.candidate.createdBy,this.candidate.createdDate,
        this.username,new Date(),this.editForm.value.email,this.candidate.resumeName,this.candidate.resumeData,
        this.editForm.value.account,this.editForm.value.userLOB,this.grossProfit,this.editForm.value.userPositionLocation,
        this.myOpenPositionGroup.value.positionName,this.myOpenPositionGroup.value.positionID);
      }
      //Candidate details for a Contractor employee whose resume is not selected
      if (this.editForm.value.employeeType == 'Contractor') {
        updatedCandidate = new Candidate(this.editForm.value.employeeName,this.editForm.value.employeeType,
        this.editForm.value.email,'',this.editForm.value.JRSS,this.editForm.value.technologyStream,
        this.editForm.value.phoneNumber,this.editForm.value.dateOfJoining,this.candidate.createdBy,
        this.candidate.createdDate,this.username,new Date(),this.editForm.value.email,this.candidate.resumeName,
        this.candidate.resumeData,this.editForm.value.account,'','','','','');
      }

      let updatedUser = new UserDetails(this.editForm.value.email,this.user.password,this.user.quizNumber,this.user.status,
        this.user.accessLevel,this.user.createdBy,this.user.CreatedDate,this.username,new Date(),this.editForm.value.dateOfJoining,
        this.user.userLoggedin);

        let formDate = new Date(this.editForm.value.dateOfJoining)
        this.currDate = new Date();

        if (!this.editForm.valid) {
          return false;
        } else {
          if (this.editForm.value.employeeType == 'Regular' ) {
            if (this.editForm.value.band == '' || this.editForm.value.userLOB == ''
                || this.editForm.value.userPositionLocation == '') {
              window.confirm("Please select Candidate Line Of Business/Candidate Location/Band");
              return false;
            }
          }
          if ( formDate > this.currDate) {
            window.confirm("Date Of Joining is a future date. Please verify.")
          } else {
             this.apiService.findUniqueUsername(this.editForm.value.email).subscribe((res) => {
              if (res.count > 0 && (this.editForm.value.email != this.candidate.email)) {
                  window.confirm("Please use another Email ID");
              } else {
                if ((res.count > 0 || res.count == 0) && ((this.editForm.value.email != this.candidate.email)
                  || (this.editForm.value.email == this.candidate.email))) {
                  if (window.confirm('Are you sure?')) {
                  let can_id = this.actRoute.snapshot.paramMap.get('id');
                  let user_id = this.actRoute.snapshot.paramMap.get('user_id');
                  this.apiService.updateUserDetails(user_id, updatedUser).subscribe(res => {
                    console.log('User Details updated successfully!');
                  }, (error) => {
                    console.log(error);
                  })
                  this.apiService.updateCandidate(can_id, updatedCandidate).subscribe(res => {
                    this.router.navigateByUrl('/candidates-list', {state:{username:this.username,accessLevel:this.accessLevel,account:this.account}});
                    console.log('Candidate Details updated successfully!');
                  }, (error) => {
                    console.log(error);
                  })
                  }
                }
              }
            }, (error) => {
              console.log(error);
          })
        }
      }
    } else {
        this.candidate.resumeName=this.editCandResume.name;
        console.log("New resume uploaded: "+this.candidate.resumeName)

        let reader = new FileReader();
        reader.readAsDataURL(this.editCandResume);
        reader.onload = (e) => {
        this.candidate.resumeData=<String>reader.result;
        //Candidate details for a regular employee whose resume is selected
        if (this.editForm.value.employeeType == 'Regular') {
          updatedCandidate = new Candidate(this.editForm.value.employeeName,this.editForm.value.employeeType, this.editForm.value.email,
          this.editForm.value.band,this.editForm.value.JRSS,this.editForm.value.technologyStream,this.editForm.value.phoneNumber,
          this.editForm.value.dateOfJoining,this.candidate.createdBy,this.candidate.createdDate,this.username,new Date(),
          this.editForm.value.email,this.candidate.resumeName,this.candidate.resumeData,this.editForm.value.account,this.editForm.value.userLOB,
          this.grossProfit,this.editForm.value.userPositionLocation,this.myOpenPositionGroup.value.positionName,this.myOpenPositionGroup.value.positionID);
        }
        //Candidate details for a contractor employee whose resume is selected
        if (this.editForm.value.employeeType == 'Contractor') {
          updatedCandidate = new Candidate(this.editForm.value.employeeName,this.editForm.value.employeeType,
          this.editForm.value.email,'',this.editForm.value.JRSS,this.editForm.value.technologyStream,this.editForm.value.phoneNumber,
          this.editForm.value.dateOfJoining,this.candidate.createdBy,this.candidate.createdDate,this.username,new Date(),
          this.editForm.value.email,this.candidate.resumeName,this.candidate.resumeData,this.editForm.value.account,'',
          '','','','');
        }

        let updatedUser = new UserDetails(this.editForm.value.email,this.user.password,this.user.quizNumber,this.user.status,
            this.user.accessLevel,this.user.createdBy,this.user.CreatedDate,this.username,new Date(),this.editForm.value.dateOfJoining,
            this.user.userLoggedin);

            let formDate = new Date(this.editForm.value.dateOfJoining)
            this.currDate = new Date();

            if (!this.editForm.valid) {
              return false;
            } else {
              if (this.editForm.value.employeeType == 'Regular' ) {
                if (this.editForm.value.band == '' || this.editForm.value.userLOB == ''
                    || this.editForm.value.userPositionLocation == '') {
                  window.confirm("Please select Candidate Line Of Business/Candidate Location/Band");
                  return false;
                }
              }
              if ( formDate > this.currDate) {
                window.confirm("Date Of Joining is a future date. Please verify.")
              } else {
              this.apiService.findUniqueUsername(this.editForm.value.email).subscribe((res) => {
                  if (res.count > 0 && (this.editForm.value.email != this.candidate.email)) {
                      window.confirm("Please use another Email ID");
                  } else {
                    if ((res.count > 0 || res.count == 0) && ((this.editForm.value.email != this.candidate.email)
                        || (this.editForm.value.email == this.candidate.email))) {
                      if (window.confirm('Are you sure?')) {
                          let can_id = this.actRoute.snapshot.paramMap.get('id');
                          let user_id = this.actRoute.snapshot.paramMap.get('user_id');
                          this.apiService.updateUserDetails(user_id, updatedUser).subscribe(res => {
                            console.log('User Details updated successfully!');
                          }, (error) => {
                            console.log(error);
                          })
                          this.apiService.updateCandidate(can_id, updatedCandidate).subscribe(res => {
                            this.router.navigateByUrl('/candidates-list', {state:{username:this.username,accessLevel:this.accessLevel,account:this.account}});
                            console.log('Candidate Details updated successfully!');
                          }, (error) => {
                          console.log(error);
                          })
                      }
                    }
                  }
                }, (error) => {
                  console.log(error);
              })
            }
        }
    }
    }
  }

   //Reset
   resetForm(){
    this.formReset = true;
    this.editForm.reset();
    this.myOpenPositionGroup.reset();
   }

   //Cancel
   cancelForm(){
     this.ngZone.run(() => this.router.navigateByUrl('/candidates-list',{state:{username:this.username,accessLevel:this.accessLevel,account:this.account}}))
   }

   //Update Userline of business
   updateUserLOBProfile(e) {
       this.editForm.get('userLOB').setValue(e, {
         onlySelf: true
       })
      this.apiService.readBandsByLOB(e).subscribe((data) => {
          this.Band = data
      })
      this.myOpenPositionGroup.get('gpUserLOB').setValue(e);
      this.gpCount = 0;
   }

   mainOpenForm() {
       this.myOpenPositionGroup = new FormGroup({
         positionName: new FormControl(),
         positionID: new FormControl(),
         rateCardJobRole: new FormControl(),
         lineOfBusiness: new FormControl(),
         positionLocation: new FormControl(),
         competencyLevel:new FormControl(),
         gpUserPositionLocation:new FormControl(),
         gpUserLOB: new FormControl(),
         gpUserBand: new FormControl(),
         grossProfit:new FormControl()
       })
   }

  // Get all PositionLocation
  readUserPositionLocation(){
     this.openPositionService.getPositionLocations().subscribe((data) => {
        this.UserPositionLocation = data;
     })
  }

  //get all open positions
  getOpenPositionDetails() {
      let status = "Open";
      if (this.editForm.value.JRSS == '') {
        window.alert("Please select candidate Job Role");
        this.displayGPCalculate = false;
        return false;
      } else {
          this.displayGPCalculate = true;
          this.openPositionService.listAllOpenPositionsBYJRSS(this.account, status,this.editForm.value.JRSS).subscribe((data) => {
             this.OpenPositions = data;
             this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(this.editForm.value.userPositionLocation);
             this.myOpenPositionGroup.get('gpUserLOB').setValue(this.editForm.value.userLOB);
             this.myOpenPositionGroup.get('gpUserBand').setValue(this.editForm.value.band);
          })
       }
  }

  updateOpenPositionProfile(positionName) {
       this.openPositionService.readOpenPositionByPositionName(positionName).subscribe((data) => {
            this.lineOfBusiness = data['lineOfBusiness'];
            this.competencyLevel = data['competencyLevel'];
            this.positionLocation = data['positionLocation'];
            this.rateCardJobRole = data['rateCardJobRole'];
          this.myOpenPositionGroup.setValue({
                positionName: data['positionName'],
                rateCardJobRole: data['rateCardJobRole'],
                positionID: data['positionID'],
                lineOfBusiness: data['lineOfBusiness'],
                positionLocation: data['positionLocation'],
                competencyLevel : data['competencyLevel'],
                gpUserPositionLocation: this.editForm.value.userPositionLocation,
                gpUserLOB: this.editForm.value.userLOB,
                gpUserBand: this.editForm.value.band,
                grossProfit: ''

          });
          this.displayPositionDetails = true;
       })
  }

   // Choose user position location with select dropdown
   updateUserPositionLocationProfile(e){
     this.editForm.get('userPositionLocation').setValue(e, {
     onlySelf: true
     })
     this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(e);
     this.gpCount = 0;
   }

   //Update Userline of business
   updateGPUserLOBProfile(e) {
     this.myOpenPositionGroup.get('gpUserLOB').setValue(e, {
       onlySelf: true
     });
      this.apiService.readBandsByLOB(e).subscribe((data) => {
       this.Band = data;
      });
      this.gpCount = 1;
   }

   // Choose band with select dropdown
   updateGPUserBandProfile(e){
     this.myOpenPositionGroup.get('gpUserBand').setValue(e, {
     onlySelf: true
     })
     this.gpCount = 1;
   }

    // Choose user position location with select dropdown
   updateGPUserPositionLocationProfile(e){
     this.myOpenPositionGroup.get('gpUserPositionLocation').setValue(e, {
     onlySelf: true
     })
     this.gpCount = 1;
   }

    calculateGP(gpUserPositionLocation,userLOB,band,positionName) {
      if (gpUserPositionLocation == null || positionName == null || gpUserPositionLocation == '' || positionName == '') {
         window.alert("Please select Open Position/User Position Location");
         return false;
      }
      if (userLOB == null || band == null || userLOB == '' || band == '') {
         window.alert("Please select User Line Of Business/Band");
         return false;
      }
      let GP: number = 0;
      let rateCardValue: number = 0;
      let costCardValue: number = 0;
      let costCardCode = ""
      let rateCardCode = ""
      rateCardCode = this.myOpenPositionGroup.value.lineOfBusiness+" - "+this.myOpenPositionGroup.value.positionLocation+" - "+
                     this.myOpenPositionGroup.value.rateCardJobRole+" - "+this.myOpenPositionGroup.value.competencyLevel;
      console.log("RateCardCode ** : ",rateCardCode);
      this.openPositionService.readRateCardsByRateCardCode(rateCardCode).subscribe((data) => {
         rateCardValue = data['rateCardValue'];
         if (band == 'Exec' || band == 'Apprentice' || band == 'Graduate') {
          costCardCode = gpUserPositionLocation+" - "+userLOB+" - "+band
         } else {
          costCardCode = gpUserPositionLocation+" - "+userLOB+" - Band-"+band
         }
         console.log("CostCardCode ** : ",costCardCode);
         this.openPositionService.readCostCardsByCostCardCode(costCardCode).subscribe((data) => {
           costCardValue = data['costCardValue'];
           if (costCardValue == null || rateCardValue == null) {
              window.alert("Candidate location and line of business are not compatible, please check the data and calculate GP again.");
              return false;
           } else {
              GP = Math.round(((rateCardValue-costCardValue)/costCardValue)*100)
           }
           if (this.gpCount == 0) {
             this.grossProfit  = GP;
           }
           this.gpCount = this.gpCount+1;
           this.myOpenPositionGroup.get('grossProfit').setValue(GP);
           this.gp = GP;
        })
     })
  }

}
