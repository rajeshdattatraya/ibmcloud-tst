export class ExceptionApprovalDetail {
    public employeeName: any;
    public JRSS: any;
		public onlineTestResult: any;
		public technicalInterviewResult:any;
		public partnerInterviewResult:any;
		public canUserId:any;
		public canUserName:any;
		public resultId:any;

		constructor(employeeName,JRSS,onlineTestResult,technicalInterviewResult,
		            partnerInterviewResult,canUserId,canUserName,resultId) {
        this.employeeName = employeeName;
		    this.JRSS = JRSS;
		    this.onlineTestResult = onlineTestResult;
        this.technicalInterviewResult = technicalInterviewResult;
        this.partnerInterviewResult = partnerInterviewResult;
        this.canUserId = canUserId;
        this.canUserName = canUserName;
        this.resultId = resultId;
    }

}
