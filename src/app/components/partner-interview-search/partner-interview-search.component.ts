import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-interview-search',
  templateUrl: './partner-interview-search.component.html',
  styles: [
    `
      .form-control {
        margin-bottom: 15px;
      }
    `
  ]
})
export class PartnerInterviewSearchComponent implements OnInit {  
  form: FormGroup;
  account: String = "";

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = '';
  constructor(private fb: FormBuilder, private router: Router) {
    this.account = this.router.getCurrentNavigation().extras.state.account;
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {    
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      JRSS: new FormControl(''),
      account: new FormControl('')
    });
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] ===  null) ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }
}
