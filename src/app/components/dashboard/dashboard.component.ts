import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  searchText: string;
  filters: Object;
  userName = "";
  accessLevel: String = "";
  ngOnInit(): void {
  }

}
