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
      jobRole: new FormControl(''),
      assignedToProject: new FormControl(''),
      partnerInterviewResult: new FormControl(''),
      technicalInterviewResult: new FormControl(''),
      userResult: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });
  }

  // Choose Assigned To Project type with select dropdown
  updateAssignedToProjectProfile(e) {
    this.form.get('assignedToProject').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Partner Interview Result type with select dropdown
  updatePartnerInterviewResultProfile(e) {
    this.form.get('partnerInterviewResult').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Partner Interview Result type with select dropdown
  updateTechInterviewResultProfile(e) {
    this.form.get('technicalInterviewResult').setValue(e, {
    onlySelf: true
    })
  }
  // Choose Online Test Result type with select dropdown
  updateOnlineResultProfile(e) {
    this.form.get('userResult').setValue(e, {
    onlySelf: true
    })
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] ===  null) ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }



}
