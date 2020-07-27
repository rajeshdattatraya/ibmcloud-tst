import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute,Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { appConfig } from './../../model/appConfig';
import { OpenPositionService } from './../../service/openPosition.service';

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


  constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private openPositionService: OpenPositionService) {
        this.config = {
              currentPage: appConfig.currentPage,
              itemsPerPage: appConfig.itemsPerPage,
              totalItems:appConfig.totalItems
        };
        this.browserRefresh = browserRefresh;
        if (!this.browserRefresh) {
            this.userName = this.router.getCurrentNavigation().extras.state.username;
            this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        }
      route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.readOpenPosition();
    }

    ngOnInit(): void {
    }

    pageChange(newPage: number) {
          this.router.navigate(['/openpositions-list'], { queryParams: { page: newPage } });
    }

   // To Read the Open Position
   readOpenPosition(){
     this.openPositionService.getAllOpenPositions().subscribe((data) => {
      this.OpenPositions = data;
     })
   }

     //To remove open position
     removeOpenPosition(openPositionID,index) {
       if(this.isRowSelected == false){
         alert("Please select the Open Position");
       } else {
       if(window.confirm('Are you sure?')) {
           this.openPositionService.deleteOpenPosition(openPositionID).subscribe((data) => {
             this.OpenPositions.splice(index, 1);
           }
         )
         this.readOpenPosition();
         this.isRowSelected = false;
       }
     }
     }

   	invokeEdit(){
       if (this.isRowSelected == false){
         alert("Please select the Open Position");
       } else {
           this.router.navigate(['/openpositions-edit/', this.openPositionID], {state:{username:this.userName,accessLevel:this.accessLevel}})
       }
     }


     onSelectionChange(openPositionID,i){
       this.openPositionID=openPositionID;
       this.index=i;
       this.isRowSelected = true;
     }
}
