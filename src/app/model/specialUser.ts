export class SpecialUser {
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
    name: string;

    constructor(username,password,quizNumber,status,acessLevel,createdBy,createdDate,updatedBy,updatedDate,DateOfJoining,userLoggedin,name){
        this.username = username;
        this.password = password;
        this.quizNumber = quizNumber;
        this.status = status;
        this.accessLevel = acessLevel;
        this.createdBy = createdBy;
        this.CreatedDate = createdDate;
        this.UpdatedBy = updatedBy;
        this.UpdatedDate = updatedDate;
        this.DateOfJoining = DateOfJoining;
        this.userLoggedin = userLoggedin;
        this.name = name;
    }

} 