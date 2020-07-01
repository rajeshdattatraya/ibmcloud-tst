import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateCreateComponent } from './components/candidate-create/candidate-create.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { CandidateEditComponent } from './components/candidate-edit/candidate-edit.component';
import { BandCreateComponent } from './components/band-create/band-create.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultPageComponent } from './components/result-page/result-page.component';
import { ChangePasswordComponent } from  './components/change-password/change-password.component';
import { TestInstructionComponent } from './components/test-instruction/test-instruction.component';
import { LoginComponent } from './components/login/login.component'
import { BandEditComponent } from './components/band-edit/band-edit.component';
import { AdminhomepageComponent } from './components/adminhomepage/adminhomepage.component';
import { QuestionsAddComponent } from './components/questions-add/questions-add.component';
import { QuestionsAddBulkComponent } from './components/question-add-bulk/questions-add-bulk.component';
import { TestConfigAddComponent } from './components/test-config-add/test-config-add.component';
import { TestConfigEditComponent } from './components/test-config-edit/test-config-edit.component'
import { DeactivateGuard } from './service/canDeactivate.candCreate';
import { JrssCreateComponent } from './components/jrss-create/jrss-create.component';
import { ViewTestresultsComponent } from './components/view-testresults/view-testresults.component';
import { StreamCreateComponent } from './components/stream-create/stream-create.component';
import { PartnerInterviewComponent } from './components/partner-interview/partner-interview.component';
import { PartnerInterviewInitiateComponent } from './components/partner-interview-initiate/partner-interview-initiate.component';
import { OperationsCandidateListComponent } from './components/operations-candidate-list/operations-candidate-list.component';
import { OperationsProjectInitiateComponent } from './components/operations-project-initiate/operations-project-initiate.component';
import { TechnicalInterviewListComponent } from './components/technical-interview-list/technical-interview-list.component';
import { PreTechFormComponent } from './components/pre-tech-form/pre-tech-form.component';
import { TechnicalInterviewComponent } from './components/technical-interview/technical-interview.component';
import { WorkflowConfigComponent } from './components/workflow-config/workflow-config.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PreTechnicalInterviewFormComponent } from './components/pre-technical-interview-form/pre-technical-interview-form.component';
import { AdminuserCreateComponent } from './components/adminuser-create/adminuser-create.component';
import { ConfigPretechassessmentFormComponent } from './components/config-pretechassessment-form/config-pretechassessment-form.component'
import { StreamDeleteComponent } from './components/stream-delete/stream-delete.component';
import { ReportComponent } from './components/report/report.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { StreamAddComponent } from './components/stream-add/stream-add.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login-component' },
  { path: '', loadChildren: './components/view-testresults/user.module#UserModule'},
  { path: '', loadChildren: './components/dashboard/dashboard-user.module#DashboardUserModule'},
  { path: '', loadChildren: './components/operations-candidate-list/operations-user.module#OperationsUserModule'},
  { path: '', loadChildren: './components/partner-interview/partner-user.module#PartnerUserModule'},
  { path: 'create-band', component: BandCreateComponent },
  { path: 'take-quiz', component: QuizComponent },
  { path: 'result-page', component: ResultPageComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'quizInstructions', component: TestInstructionComponent },
  { path: 'edit-band/:id', component: BandEditComponent },
  { path: 'create-candidate', component: CandidateCreateComponent, canDeactivate:[DeactivateGuard] },
  { path: 'edit-candidate/:id/:user_id', component: CandidateEditComponent, canDeactivate:[DeactivateGuard] },
  { path: 'candidates-list', component: CandidateListComponent },
  { path: 'login-component', component: LoginComponent },
  { path: 'adminhomepage', component: AdminhomepageComponent },
  { path: 'manage-questionbank', component:QuestionsAddComponent},
  { path: 'manage-questionbank-bulk', component:QuestionsAddBulkComponent},
  { path: 'testconfig-add', component:TestConfigAddComponent},
  { path: 'testconfig-edit/:id', component:TestConfigEditComponent},
  { path: 'jrss-create', component: JrssCreateComponent },
  { path: 'view-testresults', component:ViewTestresultsComponent},
  { path: 'stream-create', component: StreamCreateComponent },
  { path: 'technical-interview-list', component:TechnicalInterviewListComponent},
  { path: 'partner-list', component:PartnerInterviewComponent },
  { path: 'initiate-partner-interview/:id', component:PartnerInterviewInitiateComponent },
  { path: 'operations-candidate-list', component:OperationsCandidateListComponent },
  { path: 'pre-tech-form', component:PreTechFormComponent},
  { path: 'report', component:ReportComponent},
  { path: 'initiate-operations-project/:id', component:OperationsProjectInitiateComponent },
  { path: 'technical-list/:id', component:TechnicalInterviewComponent },
  { path: 'workflow-config', component:WorkflowConfigComponent },
  { path: 'dashboard', component:DashboardComponent},
  { path: 'pre-technical-interview-form/:jrss/:username',component:PreTechnicalInterviewFormComponent},
  { path: 'adminuser-create', component:AdminuserCreateComponent },
  { path:  'config-pretechassessment-form',component:ConfigPretechassessmentFormComponent },
  { path: 'delete-stream/:id', component: StreamDeleteComponent, canDeactivate:[DeactivateGuard] },
  { path: 'edit-user/:docid', component: UserEditComponent },
  { path: 'stream-add', component: StreamAddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [DeactivateGuard]
})

export class AppRoutingModule { }
