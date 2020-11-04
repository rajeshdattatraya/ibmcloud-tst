export class ViewResult {
       id: string
       userName: string;
       userScore: string;
       userResult: string;
       quizNumber: string;
       smeScores: [{technologyStream: String,score: Number}];
       avgTechScore: number;
       smeResult: string;
       managementResult: string;
       smeFeedback: String;
       managementFeedback: String;
       stage1_status: String;
       stage2_status: String;
       stage3_status: string;
       stage4_status:string;
       stage5_status:string;
       smeName:string;
       smeAssessmentDate: Date;
       managerName: string;
       managementAssessmentDate: Date;
       createdDate: Date;
       result_users: [{    id: string
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
              }];
              meeting: 
              [{  
                            id : string;
                             eventID: string;
                             eventTitle: string;
                             startDate: string;
                             startTime: string;
                             endTime: string;
                             candidateEmail: string;
                             user: string;

               }];

}
