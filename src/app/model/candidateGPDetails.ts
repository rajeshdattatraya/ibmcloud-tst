export class CandidateGPDetails {
    grossProfit:string;
    userPositionLocation:string;
    openPositionName:string;

    constructor(grossProfit,userPositionLocation,openPositionName) {
        this.grossProfit = grossProfit;
        this.userPositionLocation = userPositionLocation;
        this.openPositionName = openPositionName;
    }
}
