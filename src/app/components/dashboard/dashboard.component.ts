import { Component, OnInit } from '@angular/core';
import { browserRefresh } from '../../..../../app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  searchText: string;
  filters: Object;
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;

  constructor(private router: Router) {
    this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      }
  }
  ngOnInit(): void {
  }

}