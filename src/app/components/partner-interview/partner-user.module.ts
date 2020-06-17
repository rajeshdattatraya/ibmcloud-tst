import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartnerFilterPipe } from './partnerfilter.pipe';
import { PartnerUserRoutes } from './partner-user-routing.module';
import { ApiService } from '../../service/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { PartnerInterviewComponent } from '../partner-interview/partner-interview.component';
import { PartnerInterviewSearchComponent } from '../partner-interview-search/partner-interview-search.component';
import { PartnerInterviewListComponent } from '../partner-interview/partner-interview-list/partner-interview-list.component';


@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, PartnerUserRoutes, NgxPaginationModule ],
  declarations: [ PartnerInterviewComponent, PartnerInterviewSearchComponent, PartnerFilterPipe, PartnerInterviewListComponent ],
  providers: [ ApiService ]
})
export class PartnerUserModule { }
