
export class CandidateContractor {
   employeeName: string;
   employeeType: string;
   email: string;
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

   constructor(employeeName,employeeType, email,JRSS,technologyStream,phoneNumber
   ,dateOfJoining,createdBy,createdDate,updatedBy,updatedDate,username,resumeName,resumeData,account) {
    this.employeeName = employeeName;
    this.employeeType = employeeType;
    this.email = email;
    this.JRSS = JRSS;
    this.technologyStream = technologyStream;
    this.phoneNumber = phoneNumber;
    this.dateOfJoining = dateOfJoining;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.updatedBy = updatedBy;
    this.updatedDate = updatedDate;
    this.username = username;
    this.resumeName = resumeName;
    this.resumeData = resumeData;
    this.account = account;
   }
}
