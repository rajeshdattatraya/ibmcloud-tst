export class TestConfig {

   JRSS: string;
   noOfQuestions: number;
   testDuration: number;
   passingScore:number;

   constructor(JRSS, noOfQuestions, testDuration,passingScore) {
      this.JRSS = JRSS;
      this.noOfQuestions = noOfQuestions;
      this.testDuration = testDuration;
      this.passingScore=passingScore;
   }

}
