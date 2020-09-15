export class JRSS {
    jrss: string;
	account: string;
    technologyStream: [{key: string;
				value: string;
			}];
			
 constructor(jrss, account, technologyStream) {
        this.jrss = jrss;
		this.account = account;
   		this.technologyStream = technologyStream;
   }			
			
}