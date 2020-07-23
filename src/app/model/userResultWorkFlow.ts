export class UserResultWorkFlow {
    public userName: any;
    public userScore: any;
    public userResult: any;
		public quizNumber: any;
		public stage1_status: any;
		public stage2_status: any;
		public stage3_status: any;
		public stage4_status: any;
		public stage5_status: any;
		public createdDate:Date;

		constructor(userName,userScore,userResult,quizNumber,stage1_status,stage2_status,stage3_status,stage4_status,stage5_status) {
        this.userName = userName;
		    this.userScore = userScore;
		    this.userResult = userResult;
		    this.quizNumber = quizNumber;
		    this.stage1_status = stage1_status;
		    this.stage2_status = stage2_status;
		    this.stage3_status = stage3_status;
		    this.stage4_status = stage4_status;
		    this.stage5_status = stage5_status;
        this.createdDate = new Date();
    }

}

