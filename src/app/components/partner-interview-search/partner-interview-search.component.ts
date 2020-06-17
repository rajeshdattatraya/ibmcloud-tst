import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

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
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = '';
  constructor(private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    console.log('here in build form of search component')
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      JRSS: new FormControl('')
    });
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }
}
