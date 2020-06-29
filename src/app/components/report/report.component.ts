import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ReportService } from './report.service';
import { FormGroup, FormControl } from "@angular/forms";
import { environment } from './../../../environments/environment';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  fromDate: string;
  toDate: string;
  jrss: string;
  filters: Object;
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;
  reportResponse:any = [];
   reportData:any = [];
   reportObj = {};
   

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private reportService: ReportService,) {
    this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      }
  }
  
  ngOnInit(): void {
   this.loadReportData();
  }

//Get all report for all the JRSS, with no filters  
  loadReportData() {
         this.reportService.getReport().subscribe(res => {
          res.forEach((item) => { 
				    		 this.reportResponse.push( item._id)
			     });
			  
      this.reportResponse.sort((a,b) => a.JRSS.localeCompare(b.JRSS));

      let stage1Count = 0;
      let stage3Count = 0;
      let stage4Count = 0;
      let stage5Count = 0;
      let totalRegCandiates = 0;
		  this.reportResponse.forEach((item) => { 
         
        console.log("<<<<D<<-outside if block <<<<<< ", item.createdDate);
        if (this.reportObj[item.JRSS] ) {
          //console.log("<<<<<<Inside if block <<<<<< ", item.JRSS);
          stage1Count = this.reportObj[item.JRSS].stage1Count;
          stage3Count = this.reportObj[item.JRSS].stage3Count;
          stage4Count = this.reportObj[item.JRSS].stage4Count;
          stage5Count = this.reportObj[item.JRSS].stage5Count;
          totalRegCandiates = this.reportObj[item.JRSS].totalRegCandiates + 1;
         
        } else {
          totalRegCandiates = 1;
          stage1Count = 0;
          stage3Count = 0;
          stage4Count = 0;
          stage5Count = 0;
          
        }

        item.stage1_status.forEach((stage1Status) => { if (stage1Status == 'Completed') stage1Count++ });
        item.stage3_status.forEach((stage3Status) => { if (stage3Status == 'Completed') stage3Count++ });
        item.stage4_status.forEach((stage4Status) => { if (stage4Status == 'Completed') stage4Count++ });
        item.stage5_status.forEach((stage5Status) => { if (stage5Status == 'Completed') stage5Count++ });
        
        this.reportObj[item.JRSS] = {
          "JRSS":item.JRSS, "totalRegCandiates":totalRegCandiates, 
          "stage1Count":stage1Count, "stage3Count":stage3Count, 
          "stage4Count":stage4Count, "stage5Count":stage5Count
         };

			}); //end of reportResponse for loop
				 
        
      Object.keys(this.reportObj).forEach((key) => { 
        this.reportData.push( Object.entries(this.reportObj[key]));
      });
                
    }, (error) => {
    console.log(error);
    })
		 
  } //end of loadreportData()



  search(fromDate:String , toDate:String, jrss: String) {
   // console.log("inside search method fromDate", fromDate);
   // console.log(" inside search method  toDate", toDate);
   // console.log(" inside search method jrss", jrss);
    
  }

}

