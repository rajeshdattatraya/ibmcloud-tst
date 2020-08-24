
export class MeetingEvent {
    eventID: String;  
    eventTitle: String;  
    startDate: string;
    startTime: string;
	endTime: string;
	candidateEmail: string;
    
    constructor(eventID,eventTitle, startDate, startTime, endTime, candidateEmail) {  
     this.eventID = eventID;       
     this.eventTitle = eventTitle;   
     this.startDate = startDate;
     this.startTime = startTime;  
	 this.endTime = endTime;
	 this.candidateEmail = candidateEmail;
    }
 }
 
