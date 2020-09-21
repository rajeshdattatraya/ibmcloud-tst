export class CandidateDetails {
       id: string
       employeeName: string;
       employeeType: string;
       email: string;
       band: string;
       JRSS: string;
       technologyStream: String;
       phoneNumber: number;
       dateOfJoining: Date;
       createdBy: string;
       createdDate: Date;
       updatedBy: string;
       updatedDate: Date;
       username: String;
       resumeName: String;
       resumeData: String;
       account: String;
       userLOB: string;
       grossProfit:string;
       userPositionLocation:string;
       openPositionName:string;
       state:string;
       candidate_users: [{    id:string;
                              username: string;
                              password: string;
                              quizNumber:number;
                              status:string;
                              accessLevel:string;
                              createdBy:string;
                              CreatedDate:Date;
                              UpdatedBy:string;
                              UpdatedDate:Date;
                              DateOfJoining:Date;
                              userLoggedin:string;
       	}];

}
