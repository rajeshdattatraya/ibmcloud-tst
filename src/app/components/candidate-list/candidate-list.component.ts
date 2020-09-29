import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { CandidateDetails } from './../../model/candidateDetails';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})

export class CandidateListComponent implements OnInit {
  public browserRefresh: boolean;
  Candidate:any = [];
  candidateDetails: any = [];
  mode: any;
  config: any;
  state = "Activate";
  error = "";
  quizNumber = 1;
  status = "";
  userName = "";
  candidateId;
  candidateUsersId;
  candidateUserName;
  index;
  isRowSelected = false;
  account: any;
  accessLevel:any;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  qNumber;

  filterObj = {};
  nameFilter: string;
  emailFilter: string;
  bandFilter: string;
  jrssFilter: string;
  accountFilter: String;
  loginAdminAccounts:any=[];
  loading = true;
  dataSource = new MatTableDataSource<CandidateDetails>();

  displayedColumns = ['Action','employeeName', 'username','band','JRSS','phoneNumber','status','quizNumber','Action1'];
  displayedColumnsMultiAccount = ['Action','employeeName', 'username','band','JRSS','phoneNumber','status','quizNumber','account','Action1'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {

    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.account = this.router.getCurrentNavigation().extras.state.account;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.loginAdminAccounts = this.account.split(",");
    }

  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.dataSource.filterPredicate = (data, filter) => {
        if(data[this.filterObj['key']] && this.filterObj['key']) {
            return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
        }
        return false;
    }
    this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'status': return item.candidate_users[0].status;
          case 'quizNumber': return item.candidate_users[0].quizNumber;
          default: return item[property];
        }
     };
    this.readCandidate();
    setTimeout(() => {
        this.loading = false;
    }, 2000);
  }
  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // To Read the Candidate
  readCandidate(){
    return (this.apiService.getCandidatesForAccounts(this.account).subscribe((data) => {
      this.Candidate = data;
      this.Candidate.forEach(candidate => {
        candidate.candidate_users.forEach(user => {
          if (user.status == 'Active' && user.userLoggedin === 'true' ){ candidate.state='Clear\xa0Session'; }
		      else if (user.status == 'Active' )  { candidate.state='Disable'; }
          else {candidate.state='Enable'; }
	       });
      });
      this.dataSource.data = data as CandidateDetails[];

    })
    )
  }

  //To remove candidate
  removeCandidate(candidateUsername,candidateId, index) {
    if(this.isRowSelected == false){
      alert("Please select the candidate");
    }else{
    this.apiService.findResult(this.candidateUserName,this.qNumber).subscribe((res) => {
     if (res.count > 0) {
      alert("You can not delete this candidate as the online test stage is already completed.");
      return false;
    } else if (res.count > 0 || res.count == 0) {
      if(window.confirm('Are you sure?')) {
          this.apiService.deleteCandidate(candidateId,candidateUsername).subscribe((data) => {
            this.Candidate.splice(index, 1);
          }
        )
        this.readCandidate();
        this.isRowSelected = false;
      }
    }
  }, (error) => {
      console.log("Error found while updating userLoggedin column of Users table - " + error);
  });
  }
  }

	invokeEdit(){
    if (this.isRowSelected == false){
      alert("Please select the user");
      return false;
    } else {
       this.apiService.findResult(this.candidateUserName,this.qNumber).subscribe((res) => {
           if (res.count > 0) {
            alert("You can not edit this candidate details as the online test stage is already completed.");
            return false;
          } else if (res.count > 0 || res.count == 0) {
            this.router.navigate(['/edit-candidate/', this.candidateId, this.candidateUsersId], {state: {username:this.userName,accessLevel:this.accessLevel,account:this.account}});
          }
        }, (error) => {
            console.log("Error found while updating userLoggedin column of Users table - " + error);
        });
      }
    } 
	

  onSelectionChange(candidateId,candidateUsersId,candidateUserName,qNumber,i){
    this.candidateId=candidateId;
    this.candidateUsersId=candidateUsersId;
    this.candidateUserName=candidateUserName;
    this.qNumber=qNumber;
    this.index=i;
    this.isRowSelected = true;
  }
   //Story#27 - Activate & Inactivate candidate's status for Assessment
   updateCandidateStatus(candidate, index) {     
    //Get quizNumber and status coulmns value from Users table
    this.apiService.getUserByUserName(candidate.username).subscribe(
      (res) => {
      //If Status is Inactive and quizNumber < 3, increase quizNumber by 1 
      //and update the status and quizNumber columns of Users table 
      if (res.status === 'Inactive' && res.quizNumber < 3) {                          
          this.status = "Active";              
          this.quizNumber = ++res.quizNumber;           
          this.apiService.updateUsersStatusAndQuizNum(candidate.username,this.quizNumber,this.status,this.userName).subscribe(
            (res) => {
              console.log('Status and quizNumber columns updated successfully in Users table');                 
            }, (error) => {                  
              console.log("Error found while updating Status and QuizNumber columns of Users table - " + error);
            }); 
          candidate.candidate_users[0].status = this.status;
          candidate.candidate_users[0].quizNumber = this.quizNumber;
          
          //Update user loggedin status to false, in case it was set true for any reason
          this.apiService.updateUserLoggedinStatus(candidate.username, 'false').subscribe(
            (res) => {
            console.log('userLoggedin column updated successfully in Users table');                 
            }, (error) => {                
            console.log("Error found while updating userLoggedin column of Users table - " + error);
            });
             candidate.state = "Disable";
      }else if (res.status === 'Active' && res.userLoggedin === 'true'){
        //The above condition satisfies only when: a user logged in and he/she 
        //is in instruction page and the browser is closed before started test.
        this.apiService.updateUserLoggedinStatus(candidate.username, 'false').subscribe(
          (res) => {
          console.log('userLoggedin column updated successfully in Users table');                
          }, (error) => {                
          console.log("Error found while updating userLoggedin column of Users table - " + error);
          });
		  candidate.state = "Disable";
          alert('User login status updated successfully.');
      } else if (res.status === 'Active') {              
          this.status = "Inactive";  
          // Update status column in Users table                     
          this.apiService.updateUsersStatus(candidate.username,this.status,this.userName).subscribe(
            (res) => {
              console.log('Status column updated successfully in Users table');                 
            }, (error) => {                
             console.log("Error found while updating status column of Users table - " + error);
             }); 
          candidate.candidate_users[0].status = this.status;
          candidate.state = "Enable";	
      } else if (res.quizNumber >= 3) {             
            window.confirm('Candidate can\'t be activated !');
      } else {            
            window.confirm('Error occurred while updating candidate status !');
      }    
      }, (error) => {            
          console.log("Error found while fetching records from Users table - " + error);
      });      
} // End of updateCandidateStatus

  applyFilter(filterValue: string,key: string) {
    this.filterObj = {
          value: filterValue.trim().toLowerCase(),
          key: key
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   //To read candidate details
   getCandidateDetails(username) {
       this.mode="displayModalBody";
       this.apiService.getCandidateDetails(username).subscribe((data) => {
            this.candidateDetails = data;
            if (this.candidateDetails[0].employeeType == 'Contractor') {
                 this.displayContractorUIFields = true;
                 this.displayRegularUIFields = false;
            } else {
                 this.displayContractorUIFields = false;
                 this.displayRegularUIFields = true;
            }
       })
   }

   clearFilters() {
      this.dataSource.filter = '';
      this.nameFilter = '';
      this.emailFilter = '';
      this.bandFilter = '';
      this.jrssFilter = '';
      this.accountFilter = '';
   }

}
