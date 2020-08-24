
export class Candidate {
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
   positionID:string;

   constructor(employeeName,employeeType, email,band,JRSS,technologyStream,phoneNumber
   ,dateOfJoining,createdBy,createdDate,updatedBy,updatedDate,username,resumeName,resumeData,account,userLOB,
   grossProfit,userPositionLocation,openPositionName,positionID) {
    this.employeeName = employeeName;
    this.employeeType = employeeType;
    this.email = email;
    this.band = band;
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
    this.userLOB = userLOB;
    this.grossProfit = grossProfit;
    this.userPositionLocation = userPositionLocation;
    this.openPositionName = openPositionName;
    this.positionID = positionID;
   }
}
