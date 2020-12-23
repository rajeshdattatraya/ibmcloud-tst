import { dateSelectionJoinTransformer } from '@fullcalendar/angular';

export class UserAnswer {


        public userName: any;
        public quizNumber: any;
		public questionID: any;
        public userAnswerID: any;
        public flagged: any;
        public createdDate: Date;
        public account: any;
		
		
		constructor(userName,quizNumber, questionID, userAnswerID, flagged, createdDate, account) {
        
        this.userName = userName;
		this.quizNumber = quizNumber;
        this.questionID = questionID;
		this.userAnswerID = userAnswerID;
        this.flagged = flagged;
        this.createdDate = createdDate;
        this.account = account;
    }
    
}

/**
	userName: string;
    quizNumber: number;
	questionID: number;
    userAnswerID: string;
    flagged: boolean;
	
	constructor(data: any) {
        data = data || {};
        this.userName = data.userName;
		this.quizNumber = data.quizNumber;
        this.questionID = data.questionID;
		this.userAnswerID = data.userAnswerID;
        this.flagged = data.flagged;
    }
	**/
