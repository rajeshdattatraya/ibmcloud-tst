import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appConfig } from 'src/app/model/appConfig';

@Component({
  selector: 'app-open-positions-list',
  templateUrl: './open-positions-list.component.html',
  styleUrls: ['./open-positions-list.component.css']
})
export class OpenPositionsListComponent implements OnInit {

  pageChange:any;
  jrssSelected=false;
  itemsPerPage = appConfig.itemsPerPage;
  page=1;

  openPositionsList = [
    { "position":"Sr. java developer", "jobRole":"Java Technical Assessment", "lob":"GBS", "posLocation":"Onsite", "rateCardRole":"Developer", "compLevel":"Senior"},
    { "position":"Tester", "jobRole":" Test Automation Consultant", "lob":"GBS", "posLocation":"Onsite", "rateCardRole":"Developer", "compLevel":"Senior"},
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  //Method to redirect to the page to find the candidates for the given JRSS
  redirectToFindCandidates() {
    alert(this.jrssSelected )
    if (this.jrssSelected) {
      this.router.navigateByUrl('/eligible-candidates',{state:{jrss:this.jrssSelected}});
    } else {
      alert("Please select a position");
    }

   
  }

}
