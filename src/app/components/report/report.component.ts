import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ReportService } from './report.service';
import { browserRefresh } from '../../app.component';
import { DatePipe } from '@angular/common'
import { appConfig } from './../../model/appConfig';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  currDate: Date = new Date();
  filters: Object;
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;
  reportResponse: any = [];
  reportData: any = [];
  reportObj = {};

  itemsPerPage = appConfig.itemsPerPage;
  page=1;

  from_Date: any;
  to_Date: any;
  searchJrss: string;


  constructor(
    private router: Router,
    private ngZone: NgZone,
    private reportService: ReportService,
    public datepipe: DatePipe
    ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    }
  }


// ****************************** start of getter and setter methods **********************************
  get fromDate(): Date {
    return this.from_Date;
  }
  get toDate(): Date {
    return this.to_Date;
  }
  get jrss(): string {
    return this.searchJrss;
  }

  set fromDate(fromDate: Date) {
    this.from_Date = fromDate;
    this.searchFilter();
  }

  set toDate(toDate: Date) {
    this.to_Date = toDate;

    if (toDate < this.from_Date) throw new Error(' sdfas ');
    this.searchFilter();
  }

  set jrss(jrss: string) {
    
    this.searchJrss = jrss;
      this.searchFilter();
    
    if(jrss) {
      //This is to filter based on JRSS
      let reportDataByJrss: any = [];
      this.reportData.forEach((item) => {
        if (item[0][1].toLowerCase().startsWith(jrss.toLowerCase())) {
          reportDataByJrss.push(item);
        }
      });
     
      this.reportData = reportDataByJrss;
    } 
  }
// ****************************** end of getter and setter methods **********************************


  ngOnInit(): void {
    this.loadReportData();
  }


// ************** Get all initial report data for all the JRSS, with no filters ******************** 
  loadReportData() {
    this.reportService.getReport().subscribe(res => {
      res.forEach((item) => {
        this.reportResponse.push(item._id)
      });

      this.reportResponse.sort((a, b) => a.JRSS.localeCompare(b.JRSS));
      //The search filter, will have no impact on loading initial data 
      //No data will be filtered 
      this.searchFilter();

    }, (error) => {
      console.log(error);
    })

  } //end of loadreportData()

  //*************** Filter by from Date and To Date method ************* 
  searchFilter() {

    let stage1Count = 0;
    let stage3Count = 0;
    let stage4Count = 0;
    let stage5Count = 0;
    let toDate: any;
    let fromDate: any;
    

    let totalRegCandiates = 0;
    this.reportData = [];
    this.reportObj = {};
    if (!this.from_Date) {
      fromDate = Date.parse("1000-01-01");
    } else {
      fromDate = Date.parse(this.from_Date);
    }
    if (!this.to_Date) {
      toDate = Date.parse("9999-01-01");
    } else {
      toDate = Date.parse(this.to_Date);
    }
    //this.datepipe.transform(new Date("9999-01-01"),'yyyy-MM-dd');

    this.reportResponse.forEach((item) => {

      let registeredDate = Date.parse(item.createdDate);

      if (registeredDate >= fromDate && registeredDate <= toDate) {
        if (this.reportObj[item.JRSS]) {
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
          "JRSS": item.JRSS, "totalRegCandiates": totalRegCandiates,
          "stage1Count": stage1Count, "stage3Count": stage3Count,
          "stage4Count": stage4Count, "stage5Count": stage5Count
        };
      }

    }); //end of reportResponse for loop


    Object.keys(this.reportObj).forEach((key) => {
      this.reportData.push(Object.entries(this.reportObj[key]));
    });
  }


}

