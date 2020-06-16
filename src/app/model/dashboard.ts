export class Dashboard {
    public employeeName: any;
    public jobRole: any;
		public onlineTestResult: any;
		public technicalInterviewResult:any;
		public partnerInterviewResult:any;
		public assignedToProject:any;

		constructor(employeeName,jobRole,onlineTestResult,technicalInterviewResult,
		            partnerInterviewResult,assignedToProject) {
        this.employeeName = employeeName;
		    this.jobRole = jobRole;
		    this.onlineTestResult = onlineTestResult;
        this.technicalInterviewResult = technicalInterviewResult;
        this.partnerInterviewResult = partnerInterviewResult;
        this.assignedToProject = assignedToProject;
    }

}

