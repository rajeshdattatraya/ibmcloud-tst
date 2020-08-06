import { Component } from '@angular/core';
import { browserRefresh } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-testresults',
  templateUrl: './view-testresults.component.html',
  styleUrls: ['./view-testresults.component.css']
})
export class ViewTestresultsComponent {
  public browserRefresh: boolean;
  searchText: string;
  filters: Object;
  userName = "";
  account = "";

  constructor(private router: Router) {
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
      }
  }

  ngOnInit(): void {
  this.browserRefresh = browserRefresh;
  }
}
