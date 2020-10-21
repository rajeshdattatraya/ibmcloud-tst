import { Component, OnInit } from '@angular/core';
import { browserRefresh } from '../../..../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

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
  account: String = "";
  name: String="";

  constructor(private router: Router,private apiService: ApiService) {
    this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.getCandidate();
        }
  }
  getCandidate(){
    this.apiService.getNameFromUsername(this.userName).subscribe( (res) => {
    this.name = res.name;        
  });
}
  ngOnInit(): void {
  }

}
