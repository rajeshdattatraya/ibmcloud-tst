export class OperationsDetails {
    userName: String;
    location: string;
    clientProject: string;
    projectName: string;
    position: string;
    comments: string;
    createdBy: String;
    createdDate: Date;
 
    constructor(userName, location, clientProject, projectName, position, comments, createdBy, createdDate) {
            this.userName = userName;
            this.location = location;
            this.clientProject = clientProject;
            this.projectName = projectName;
            this.position  = position;
            this.comments = comments;
            this.createdBy = createdBy;
            this.createdDate = createdDate;
    }
 
 }
