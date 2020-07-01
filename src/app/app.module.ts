import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CandidateCreateComponent } from './components/candidate-create/candidate-create.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { CandidateEditComponent } from './components/candidate-edit/candidate-edit.component';
import { BandCreateComponent } from './components/band-create/band-create.component';
import { BandEditComponent } from './components/band-edit/band-edit.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './service/api.service';
import { TestInstructionComponent } from './components/test-instruction/test-instruction.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultPageComponent } from './components/result-page/result-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { DatePipe } from '@angular/common'
import { AdminhomepageComponent } from './components/adminhomepage/adminhomepage.component'
import { QuestionsAddComponent } from './components/questions-add/questions-add.component';
import { QuestionsAddBulkComponent } from './components/question-add-bulk/questions-add-bulk.component';
import { TestConfigAddComponent } from './components/test-config-add/test-config-add.component';
import { TestConfigEditComponent } from './components/test-config-edit/test-config-edit.component';
import { JrssCreateComponent } from './components/jrss-create/jrss-create.component';
import { StreamCreateComponent } from './components/stream-create/stream-create.component';
import { UserModule} from './components/view-testresults/user.module';
import { DashboardUserModule } from './components/dashboard/dashboard-user.module';
import { OperationsUserModule } from './components/operations-candidate-list/operations-user.module';
import { PartnerUserModule } from './components/partner-interview/partner-user.module';
import { PartnerInterviewInitiateComponent } from './components/partner-interview-initiate/partner-interview-initiate.component';
import { OperationsProjectInitiateComponent } from './components/operations-project-initiate/operations-project-initiate.component';
import { TechnicalInterviewListComponent } from './components/technical-interview-list/technical-interview-list.component';
import { PreTechFormComponent } from './components/pre-tech-form/pre-tech-form.component';
import { TechnicalInterviewComponent } from './components/technical-interview/technical-interview.component';
import { WorkflowConfigComponent } from './components/workflow-config/workflow-config.component';
import { PreTechnicalInterviewFormComponent } from './components/pre-technical-interview-form/pre-technical-interview-form.component';
import { AdminuserCreateComponent } from './components/adminuser-create/adminuser-create.component';
import { ConfigPretechassessmentFormComponent } from './components/config-pretechassessment-form/config-pretechassessment-form.component';
import { StreamDeleteComponent } from './components/stream-delete/stream-delete.component';
import { ReportComponent } from './components/report/report.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { StreamAddComponent } from './components/stream-add/stream-add.component';


export let browserRefresh = false;

@NgModule({
  declarations: [
    AppComponent,
    CandidateCreateComponent,
    CandidateListComponent,
    CandidateEditComponent,
    BandCreateComponent,
    BandEditComponent,
    TestInstructionComponent,
    QuizComponent,
    ResultPageComponent,
    LoginComponent,
    ChangePasswordComponent,
    AdminhomepageComponent,
    QuestionsAddComponent,
    QuestionsAddBulkComponent,
    TestConfigAddComponent,
    TestConfigEditComponent,
    JrssCreateComponent,
    StreamCreateComponent,   
    PartnerInterviewInitiateComponent,   
    OperationsProjectInitiateComponent,
    TechnicalInterviewListComponent,
    PreTechFormComponent,
    TechnicalInterviewComponent,
    WorkflowConfigComponent,
    PreTechnicalInterviewFormComponent,
    AdminuserCreateComponent,
    ConfigPretechassessmentFormComponent,
    StreamDeleteComponent,
    ReportComponent,
    UserEditComponent,
    StreamAddComponent   
    ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
	  FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserModule,
    DashboardUserModule,
    OperationsUserModule,
    PartnerUserModule,
    [ NgxPaginationModule ],
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    })

  ],
  providers: [ApiService, DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
