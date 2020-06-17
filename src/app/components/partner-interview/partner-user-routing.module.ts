import { RouterModule, Routes } from '@angular/router';
import { PartnerInterviewComponent } from './partner-interview.component';

const routes: Routes = [
  { path: '', component: PartnerInterviewComponent }
];

export const PartnerUserRoutes = RouterModule.forChild(routes);

