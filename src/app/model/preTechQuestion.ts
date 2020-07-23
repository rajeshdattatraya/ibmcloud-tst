export class PreTechQuestion {


    public preTechQID: any;
    public jrss: any;
    public preTechQuestion: any;
    //public userName: any;
    //public answer: any;
    public createdBy: any;
    public createdDate:Date;
    
    constructor(preTechQID,jrss,preTechQuestion,createdBy) {

      console.log("The passed values are "+preTechQID+", "+jrss+", "+preTechQuestion+", "+createdBy)
  
      this.preTechQID = preTechQID;
      this.jrss = jrss;
      this.preTechQuestion = preTechQuestion;
      this.createdBy = createdBy;
      this.createdDate = new Date();
      }
  
  }