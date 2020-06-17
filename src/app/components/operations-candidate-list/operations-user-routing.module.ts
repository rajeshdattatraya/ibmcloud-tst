import { RouterModule, Routes } from '@angular/router';
import { OperationsCandidateListComponent } from './operations-candidate-list.component';

const routes: Routes = [
  { path: '', component: OperationsCandidateListComponent }
];

export const OperationsUserRoutes = RouterModule.forChild(routes);

