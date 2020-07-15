export class ResultStatus {
    public userName: any;
    public quizNumber: any;
    public userScore: any;
		public stage1_status: any;
		public stage2_status: any;
		public stage3_status: any;
		public smeResult: any;
		public stage4_status: any;
		public managementResult: any;
		public stage5_status: any;


		constructor(userName,quizNumber,userScore,stage1_status,stage2_status,stage3_status,smeResult,stage4_status,managementResult,stage5_status) {
		    this.userName = userName;
		    this.quizNumber = quizNumber;
		    this.userScore = userScore;
		    this.stage1_status = stage1_status;
		    this.stage2_status = stage2_status;
		    this.stage3_status = stage3_status;
		    this.smeResult = smeResult;
		    this.stage4_status = stage4_status;
		    this.managementResult = managementResult;
		    this.stage5_status = stage5_status;
		}

}

