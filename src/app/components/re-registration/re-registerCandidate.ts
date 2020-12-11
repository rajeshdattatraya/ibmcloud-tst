import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { RegistrationConfigService } from 'src/app/service/registrationConfig.service';
import { AssignedToProjectCandidate } from './assignedToProjectCandidate';
import { AwaitingPartnerInterview } from './awaitingPartnerInterview';
import { AwaitingProjectAllocation } from './awaitingProjectAllocation';
import { AwaitingTechInterview } from './awaitingTechInterview';
import { BackupDataService } from './backup-data.service';
import { FailedCandidate } from './failedCandidate';

/**
 * This class will have various methods required to Re-register a candidate into the system
 */
@Injectable({
    providedIn: 'root'
})
export class ReRegisterCandidate {

    canReleaseFailedCanidate: boolean = false;
    canReleaseCandidateAwtingTechInt: boolean = false;
    canReleaseCandidateAwtingPtnrInt: boolean = false;
    canReleaseCandidateAwtingProjAlloc: boolean = false;
    canReleaseCandidateAssignedToProject: boolean = false;

    candidatesRetainDay: any;

    constructor(
        private apiService: ApiService,
        private registrationConfigService: RegistrationConfigService,
        private backupDataService: BackupDataService,
        private failedCandidate: FailedCandidate,
        private awaitingTechInterviewService: AwaitingTechInterview,
        private awaitingPartnerInterview: AwaitingPartnerInterview,
        private awaitingProjectAllocation: AwaitingProjectAllocation,
        private assignedToProjectCandidate: AssignedToProjectCandidate) {

        this.getCandidatesRegistrationRetainDays();
    }



    // Get candidate stage's retain day from RegistrationConfig table
    getCandidatesRegistrationRetainDays() {
        this.registrationConfigService.getStageCandidatesRetainDay().subscribe((data) => {
            this.candidatesRetainDay = data;
        })
    }

    //This method will backup the candidate data before registering
    // 1) Users
    // 2) Candidate
    // 3) UserAnswer
    // 4) Results
    // 5) PreTechAssessmentAnswer
    // 6) ProjectAlloc
    backupCandidateData(username) {
        this.backupDataService.backupCandidateData(username).subscribe(data => {
        })
    }


    //Start - Integration of Candindate Registration funcations

    //This method takes username as an input to determine whether the candidate can be re-registered or not
    //It returns a boolean value - true to indicate to re-register, false to not to re-register

    reRegisterCandidate(userName): boolean {
        var canReRegisterCandidate = false;


        this.apiService.getNameFromUsername(userName).subscribe(res => {

            var quizNumber = res.quizNumber;
            var updatedDate = res.UpdatedDate;

            console.log(`inside the reReg Method`);

            this.failedCandidate.isCandidateFailed(
                userName, quizNumber, updatedDate, this.candidatesRetainDay[0].retainFailedCandidates, (data) => {
                    this.canReleaseFailedCanidate = data;
                });

            this.awaitingTechInterviewService.isCandidateAwaitingInTechInterviewQ(
                userName, quizNumber, this.candidatesRetainDay[0].retainStage3Candidates, (data) => {
                    this.canReleaseCandidateAwtingTechInt = data;
                });

            this.awaitingPartnerInterview.isCandidateAwaitingInPartnerInterviewQ(
                userName, quizNumber, this.candidatesRetainDay[0].retainStage4Candidates, (data) => {
                    this.canReleaseCandidateAwtingPtnrInt = data;
                });

            this.awaitingProjectAllocation.isCandidateAwaitingInProjectAllocationQueue(
                userName, quizNumber, this.candidatesRetainDay[0].retainStage5Candidates, (data) => {
                    this.canReleaseCandidateAwtingProjAlloc = data;
                });

            this.assignedToProjectCandidate.isCandidateAssigned(
                userName, this.candidatesRetainDay[0].retainProjectCandidates, (data) => {
                    this.assignedToProjectCandidate = data;
                });

            if (this.canReleaseFailedCanidate || this.canReleaseCandidateAwtingTechInt || this.canReleaseCandidateAwtingPtnrInt
                || this.canReleaseCandidateAwtingProjAlloc || this.assignedToProjectCandidate) {
                canReRegisterCandidate = true;
            }
            console.log(`canReRegisterCandidate *** ` + canReRegisterCandidate);


        });//end of cnadi

        return canReRegisterCandidate;
    }




}

