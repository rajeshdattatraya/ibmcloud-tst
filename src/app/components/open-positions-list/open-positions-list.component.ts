import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { appConfig } from 'src/app/model/appConfig';
import { OpenPositionDetail } from './../../model/openPositionDetail';
import { PositionsService } from 'src/app/components/open-positions-list/positions.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

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
  account="";

  openPositionsList:any = [];
  loginAdminAccounts:any = [];
  positionID;
  userName;
  accessLevel;
  loading = true;
  dataSource = new MatTableDataSource<OpenPositionDetail>();

  displayedColumns = ['Action','positionName', 'positionID','JRSS','lineOfBusiness','positionLocation','rateCardJobRole','competencyLevel'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private router: Router,
    private positionsService: PositionsService) {
    this.account = this.router.getCurrentNavigation().extras.state.account;
    this.userName = this.router.getCurrentNavigation().extras.state.username;
    this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    this.loginAdminAccounts = this.account.split(",");
  }

  ngOnInit(): void {
    this.listAllOpenPositions()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


    // To Read the Open Position
    listAllOpenPositions() {
      const status="Open";
      this.positionsService.listAllOpenPositions(this.account, status).subscribe((data) => {
        this.openPositionsList = data;
        this.dataSource.data = data as OpenPositionDetail[];

      })
  }


  //Method to redirect to the page to find the candidates for the given JRSS
  redirectToFindCandidates() {
    if (this.jrssSelected) {
      this.router.navigateByUrl('/eligible-candidates',{state:{jrss:this.jrssSelected, accessLevel:this.accessLevel, account:this.account, positionID:this.positionID}});
    } else {
      alert("Please select a position");
    }


  }

}
