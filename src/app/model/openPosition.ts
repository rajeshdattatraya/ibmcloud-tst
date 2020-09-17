export class OpenPosition {
    positionName: String;
    positionID: String;
    sequenceID: String;
    JRSS: String;
    rateCardJobRole: String;
    lineOfBusiness: String;
    positionLocation: String;
    competencyLevel: String;
    account: String;
    status: String;
    createdBy: String;
    createdDate: String;
    updatedBy: String;
    updatedDate: String;

    constructor(positionName,positionID,sequenceID,JRSS,rateCardJobRole,lineOfBusiness,positionLocation,competencyLevel,
               account, status,createdBy,createdDate,updatedBy,updatedDate) {
               this.positionName = positionName;
               this.positionID = positionID;
               this.sequenceID = sequenceID;
               this.JRSS = JRSS;
               this.rateCardJobRole = rateCardJobRole;
               this.lineOfBusiness = lineOfBusiness;
               this.positionLocation = positionLocation;
               this.competencyLevel = competencyLevel;
               this.account = account;
               this.status = status;
               this.createdBy = createdBy;
               this.createdDate = createdDate;
               this.updatedBy = updatedBy;
               this.updatedDate = updatedDate;

    }

}
