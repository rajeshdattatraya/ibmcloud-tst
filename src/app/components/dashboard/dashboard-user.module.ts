import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardSearchComponent } from '../dashboard-search/dashboard-search.component';
import { DashboardFilterPipe } from './dashboardfilter.pipe';
import { DashboardUserRoutes } from './dashboard-user-routing.module';
import { ApiService } from './../../service/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, DashboardUserRoutes,NgxPaginationModule ],
  declarations: [ DashboardComponent, DashboardSearchComponent,  DashboardFilterPipe, DashboardListComponent ],
  providers: [ ApiService ]
})
export class DashboardUserModule { }
