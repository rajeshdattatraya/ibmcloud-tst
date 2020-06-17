import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperationsCandidateListComponent } from './operations-candidate-list.component';
import { OperationsFilterPipe } from './operationsfilter.pipe';
import { OperationsUserRoutes } from './operations-user-routing.module';
import { ApiService } from '../../service/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { OperationsCandidateSearchListComponent } from '../operations-candidate-list/operations-candidate-search-list/operations-candidate-search-list.component';
import { OperationsCandidateSearchComponent } from '../operations-candidate-search/operations-candidate-search.component';


@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, OperationsUserRoutes,NgxPaginationModule ],
  declarations: [ OperationsCandidateListComponent, OperationsCandidateSearchComponent,  OperationsFilterPipe, OperationsCandidateSearchListComponent ],
  providers: [ ApiService ]
})
export class OperationsUserModule { }
