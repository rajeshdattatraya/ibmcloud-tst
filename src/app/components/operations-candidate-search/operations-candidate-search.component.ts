import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';

@Component({
  selector: 'app-operations-candidate-search',
  templateUrl: './operations-candidate-search.component.html',
  styles: [
    `
      .form-control {
        margin-bottom: 15px;
      }
    `
  ]
})
export class OperationsCandidateSearchComponent implements OnInit {
  form: FormGroup;
  account: String = "";
  AccountData:any = [];
  AccountList:any=[];

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = '';
  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) {
    this.account = this.router.getCurrentNavigation().extras.state.account;
    this.readAccount();
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {    
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      account: new FormControl('')
    });
  }

    // Get all Accounts
    readAccount(){
      this.apiService.getAccounts().subscribe((data) => {
      this.AccountData = data;
      //Remove 'sector' from Account collection
      for (var accValue of this.AccountData){    
          if(accValue.account.toLowerCase() !== 'sector' ) {
            this.AccountList.push(accValue.account);             
          }            
      }      
      })
    }
  
      // Choose account result with select dropdown
      updateAccountDetails(e) {
        this.form.get('account').setValue(e, {
        onlySelf: true
        })
      }

  search(filters: any): void {
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] ===  null) ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }

}
