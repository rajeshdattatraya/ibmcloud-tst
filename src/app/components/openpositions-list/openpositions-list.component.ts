import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute,Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { OpenPositionService } from './../../service/openposition.service';
import { OpenPositionDetail } from './../../model/openPositionDetail';
import { PositionsService } from 'src/app/components/open-positions-list/positions.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-openpositions-list',
  templateUrl: './openpositions-list.component.html',
  styleUrls: ['./openpositions-list.component.css']
})
export class OpenpositionsListComponent implements OnInit {
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;
  OpenPositions:any = [];
  config: any;
  isRowSelected = false;
  openPositionID;
  index;
  account: String ="";
  loading = true;
  filterObj = {};
  positionIDFilter: string;
  positionLocationFilter: string;
  jrssFilter: string;
  accountFilter: string;
  loginAdminAccounts:any = [];
  dataSource = new MatTableDataSource<OpenPositionDetail>();

  displayedColumns = ['Action','positionName', 'positionID','JRSS','lineOfBusiness','positionLocation','rateCardJobRole','competencyLevel'];
  displayedColumnsMultiAccount = ['Action','positionName', 'positionID', 'account','JRSS','lineOfBusiness','positionLocation','rateCardJobRole','competencyLevel'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private openPositionService: OpenPositionService,
        private positionsService: PositionsService) {
        this.browserRefresh = browserRefresh;
        if (!this.browserRefresh) {
            this.userName = this.router.getCurrentNavigation().extras.state.username;
            this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
            this.account = this.router.getCurrentNavigation().extras.state.account;
            this.loginAdminAccounts = this.account.split(",");
        }
    }

    ngOnInit(): void {
      this.dataSource.filterPredicate = (data, filter) => {
        if(data[this.filterObj['key']] && this.filterObj['key']) {
            if (data[this.filterObj['key']].toLowerCase().startsWith(this.filterObj['value'])) {
               return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
            }
        }
        return false;
      }
      this.readOpenPosition();
    }

    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

   // To Read the Open Position
   readOpenPosition(){
     let status = "Open";
     this.positionsService.listAllOpenPositions(this.account, status).subscribe((data) => {
      this.OpenPositions = data;
      this.dataSource.data = data as OpenPositionDetail[];
     })
   }

     //To remove open position
     removeOpenPosition(openPositionID) {
       if(this.isRowSelected == false){
         alert("Please select the Open Position");
       } else {
       if(window.confirm('Are you sure?')) {
           this.openPositionService.deleteOpenPosition(openPositionID).subscribe((data) => {
              this.readOpenPosition();
              this.isRowSelected = false;
           }
         )
       }
     }
     }

   	invokeEdit(){
       if (this.isRowSelected == false){
         alert("Please select the Open Position");
       } else {
           this.router.navigate(['/openpositions-edit/', this.openPositionID], {state:{username:this.userName,accessLevel:this.accessLevel,account:this.account}})
       }
     }

     onSelectionChange(openPositionID){
       this.openPositionID=openPositionID;
       this.isRowSelected = true;
     }

     clearFilters() {
       this.dataSource.filter = '';
       this.positionIDFilter = '';
       this.positionLocationFilter = '';
       this.jrssFilter = '';
       this.accountFilter = '';
     }

     applyFilter(filterValue: string,key: string) {
        this.filterObj = {
              value: filterValue.trim().toLowerCase(),
              key: key
        }
        this.dataSource.filter = filterValue.trim().toLowerCase();
     }

}
