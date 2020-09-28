
export class MeetingEvent {
    eventID: String;  
    eventTitle: String;  
    startDate: string;
    startTime: string;
	endTime: string;
    candidateEmail: string;
    user: string;
    
    constructor(eventID,eventTitle, startDate, startTime, endTime, candidateEmail, user) {  
     this.eventID = eventID;       
     this.eventTitle = eventTitle;   
     this.startDate = startDate;
     this.startTime = startTime;  
	 this.endTime = endTime;
     this.candidateEmail = candidateEmail;
     this.user = user;
    }
 }
 
