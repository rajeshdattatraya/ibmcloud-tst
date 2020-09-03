import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userName: String = "";
  account: String = "";
  accessLevel: String = "";

  constructor(private router: Router) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
                      console.log("nav this.accesslevel",this.accessLevel);
                      console.log("nav this.userName",this.userName);
                      console.log("nav this.account",this.account);
  }

  ngOnInit(): void {
  }

}
