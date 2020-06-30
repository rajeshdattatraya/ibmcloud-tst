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
  PartnerInterviewResult: any = ['Selected','NotSelected', 'StandBy'];
  TechInterviewResult: any = ['Selected','NotSelected', 'StandBy'];
  submitted = false;
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

  search(filters: any): void {
    if (filters.stage5_status == 'Assigned') {
      filters.stage5_status = "Completed";
    } else if (filters.stage5_status == 'Unassigned') {
      filters.stage5_status = "Not Started";
    }
    if (filters.managementResult == 'Selected') {
      filters.managementResult = "Recommended";
    } else if (filters.managementResult == 'NotSelected') {
      filters.managementResult = "Not Suitable";
    } else if (filters.managementResult == 'StandBy') {
            filters.managementResult = "StandBy";
    }
    if (filters.smeResult == 'Selected') {
      filters.smeResult = "Recommended,Strongly Recommended";
    } else if (filters.smeResult == 'NotSelected') {
      filters.smeResult = "Not Suitable";
    } else if (filters.smeResult == 'StandBy') {
      filters.smeResult = "StandBy";
    }
    Object.keys(filters).forEach(key => filters[key] === '' ? delete filters[key] : key);
    this.groupFilters.emit(filters);
  }



}
