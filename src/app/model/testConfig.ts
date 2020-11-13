export class TestConfig {

   JRSS: string;
   account: string;
   noOfQuestions: number;
   testDuration: number;
   passingScore:number;
   testConfigs_jrss: [{
      jrss:string;
   }];
   constructor(JRSS,account, noOfQuestions, testDuration,passingScore) {
      this.JRSS = JRSS;
      this.account = account;
      this.noOfQuestions = noOfQuestions;
      this.testDuration = testDuration;
      this.passingScore=passingScore;
   }

}
