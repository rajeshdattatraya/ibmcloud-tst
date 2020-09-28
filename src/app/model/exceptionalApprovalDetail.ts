export class ExceptionApprovalDetail {
    public employeeName: any;
    public JRSS: any;
    public canAccount:any;
		public onlineTestResult: any;
		public userResult: any;
		public technicalInterviewResult:any;
		public partnerInterviewResult:any;
		public canUserId:any;
		public canUserName:any;
		public resultId:any;
		public uScore:any;
		public qNumber:any;
		public createdDate:any;

		constructor(employeeName,JRSS,canAccount,onlineTestResult,technicalInterviewResult,
		            partnerInterviewResult,canUserId,canUserName,resultId,userResult,
		            uScore,qNumber,createdDate) {
        this.employeeName = employeeName;
			  this.JRSS = JRSS;
			  this.canAccount = canAccount;
			  this.userResult = userResult;
		    this.onlineTestResult = onlineTestResult;
        this.technicalInterviewResult = technicalInterviewResult;
        this.partnerInterviewResult = partnerInterviewResult;
        this.canUserId = canUserId;
        this.canUserName = canUserName;
        this.resultId = resultId;
        this.uScore = uScore;
        this.qNumber = qNumber;
        this.createdDate = createdDate;
    }

}

