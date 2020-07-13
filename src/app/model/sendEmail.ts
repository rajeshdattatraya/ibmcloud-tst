
export class SendEmail {
   from: String;  
   to: string;
   subject: string;
   message: string;
   password: string;
   
   constructor(from, to, subject, message, password ) {    
    this.from = from;   
    this.to = to;
    this.subject = subject;  
    this.message = message; 
    this.password = password;   
   }
}
