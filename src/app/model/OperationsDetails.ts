export class OperationsDetails {
    userName: String;
    location: string;
    clientProject: string;
    position: string;
    comments: string;
    createdBy: String;
    createdDate: Date;
 
    constructor(userName, location, clientProject, position, comments, createdBy, createdDate) {
            this.userName = userName;
            this.location = location;
            this.clientProject = clientProject;
            this.position  = position;
            this.comments = comments;
            this.createdBy = createdBy;
            this.createdDate = createdDate;
    }
 
 }
