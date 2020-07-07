import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard-search',
  templateUrl: './dashboard-search.component.html',
  styles: [
    `
      .form-control {
        margin-bottom: 15px;
      }
    `
  ]
})
export class DashboardSearchComponent implements OnInit {
  AssignedToProject:any = ['Assigned','Unassigned'];
  PartnerInterviewResult: any = ['Recommended','Not Suitable', 'StandBy'];
  TechInterviewResult: any = ['Strongly Recommended','Recommended','Not Suitable','StandBy'];
  OnlineResult: any = ['Pass','Fail'];
  submitted = false;
  currDate: Date = new Date();
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
      JRSS: new FormControl(''),
      stage5_status: new FormControl(''),
      managementResult: new FormControl(''),
      smeResult: new FormControl(''),
      stage1_status: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });
  }

  // Choose Assigned To Project type with select dropdown
  updateAssignedToProjectProfile(e) {
    this.form.get('stage5_status').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Partner Interview Result type with select dropdown
  updatePartnerInterviewResultProfile(e) {
    this.form.get('managementResult').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Partner Interview Result type with select dropdown
  updateTechInterviewResultProfile(e) {
    this.form.get('smeResult').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Online Test Result type with select dropdown
  updateOnlineResultProfile(e) {
    this.form.get('stage1_status').setValue(e, {
    onlySelf: true
    })
  }

  search(filters: any): void {
    if (filters.stage5_status == 'Assigned') {
      filters.stage5_status = "Completed";
    } else if (filters.stage5_status == 'Unassigned') {
      filters.stage5_status = "Not Started";
    }
    if (filters.stage1_status == 'Pass') {
      filters.stage1_status = "Completed";
    } else if (filters.stage1_status == 'Fail') {
      filters.stage1_status = "Not Started";
    }
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] ===  null) ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }



}
