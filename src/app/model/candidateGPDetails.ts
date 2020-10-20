export class CandidateGPDetails {
    grossProfit:string;
    userPositionLocation:string;
    openPositionName:string;
    positionID:string;

    constructor(grossProfit,userPositionLocation,openPositionName,positionID) {
        this.grossProfit = grossProfit;
        this.userPositionLocation = userPositionLocation;
        this.openPositionName = openPositionName;
        this.positionID = positionID;
    }
}
