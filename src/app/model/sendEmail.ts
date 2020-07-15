
export class SendEmail {
   from: String;  
   to: string;
   subject: string;
   message: string; 
   
   constructor(from, to, subject, message) {    
    this.from = from;   
    this.to = to;
    this.subject = subject;  
    this.message = message;    
   }
}
