export class Dashboard {
    public employeeName: any;
    public jobRole: any;
    public canAccount: any;
		public onlineTestResult: any;
		public technicalInterviewResult:any;
		public partnerInterviewResult:any;
		public assignedToProject:any;
		public canUserId:any;
		public canUserName:any;
		public resultId:any;
		public userResult:any;
		public qNumber:any;
		public uScore:any;
		public createdDate:any;

		constructor(employeeName,jobRole,canAccount,onlineTestResult,technicalInterviewResult,
		            partnerInterviewResult,assignedToProject,canUserId,canUserName,
		            resultId,userResult,qNumber,uScore,createdDate) {
        this.employeeName = employeeName;
		    this.jobRole = jobRole;
		    this.canAccount = canAccount;
		    this.onlineTestResult = onlineTestResult;
        this.technicalInterviewResult = technicalInterviewResult;
        this.partnerInterviewResult = partnerInterviewResult;
        this.assignedToProject = assignedToProject;
        this.assignedToProject = assignedToProject;
        this.canUserId = canUserId;
        this.canUserName = canUserName;
        this.resultId = resultId;
        this.userResult = userResult;
        this.qNumber = qNumber;
        this.uScore = uScore;
        this.createdDate = createdDate;
    }

}

