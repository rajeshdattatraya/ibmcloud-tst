
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

   constructor(employeeName,employeeType, email,band,JRSS,technologyStream,phoneNumber
   ,dateOfJoining,createdBy,createdDate,updatedBy,updatedDate,username,resumeName,resumeData) {
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
   }
}
