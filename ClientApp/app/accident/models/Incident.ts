import { AgencyInvolved } from "./AgencyInvolved";
import { Category } from "./Category";
import { IncidentInjuryLocation } from "./IncidentInjuryLocation";
import { Location } from "./Location";
import { Person } from "./Person";
import { SummaryOfCause } from "./SummaryOfCause";
import { Type } from "./Type";
import { YesNoMaybe } from "./YesNoMaybe";

export class Incident {
    public id: number;
    public locationId: number;
    public personInvolvedId: number;
    public hasOtherPersonsInvolved: boolean;
    public hasOtherAgenciesInvolved: boolean;
    public ableToResumeId: number;
    public sentHomeId: number;
    public sentHospitalId: number;
    public mediAttnRequiredId: number;
    public incidentCategoryId: number;
    public incidentTypeId: number;
    public locationDetails: string;
    public dateAndTimeOfIncident: Date;
    public personCompFormId: number;
    public dateAndTimeFormCompleted: Date;
    public firstRepPersonId: number;
    public dateAndTimeFirstReported: Date;
    public locationFirstReportedId: number;
    public incidentDetails: string;
    public riskAssessInPlaceId: number;
    public riskAssessInPlaceDetails: string;
    public riskAssessInPlaceAuthUser: string;
    public riskAssessInPlaceAuthDate: Date;
    public riskAssessReviewedId: number;
    public riskAssessReviewedDetails: string;
    public riskAssessReviewedAuthUser: string;
    public riskAssessReviewedAuthDate: Date;
    public riskAssessNewId: number;
    public riskAssessNewDetails: string;
    public riskAssessNewAuthUser: string;
    public riskAssessNewAuthDate: Date;
    public careManagerInformedId: number;
    public careManagerInformedAuthUser: string;
    public careManagerInformedAuthDate: Date;
    public natureOfInjuryDetails: string;
    public treatmentGivenDetails: string;
    public preventitiveActionDetails: string;
    public furtherActionDetails: string;
    public daysAbsent: number;
    public isReportable: boolean;
    public howReported: string;
    public localReference: string;
    public hasNotificationEmailBeenSent: boolean;
    public recordUser: string;
    public healthSafetyOfficerComments: string;
    public exlcudeIncidentFromReportingStats: boolean;
    public whyExcludedFromStatsDetails: string;
    public isFurtherActionRequired: boolean;
    public isFurtherActionComplete: boolean;
    public furtherActionCompleteAuthUser: string;
    public furtherActionCompleteAuthDate: Date;

    public locationOfIncident: Location;
    public personInvolved: Person;
    public wasAbleToResumeWork: YesNoMaybe;
    public wasSentHome: YesNoMaybe;
    public wasSentToHospital: YesNoMaybe;
    public wasMedicalAttentionRequired: YesNoMaybe;
    public category: Category;
    public type: Type;
    public personCompletingForm: Person;
    public personFirstReportedTo: Person;
    public locationFirstReportedTo: Location;
    public wasRiskAssessInPlace: YesNoMaybe;
    public hasRiskAssessBeenReviewed: YesNoMaybe;
    public isNewRiskAssessBeingIntroduced: YesNoMaybe;
    public hasCareManagerBeenInformed: YesNoMaybe;

    public agenciesInvolved: AgencyInvolved[];
    public incidentInjuryLocations: IncidentInjuryLocation[];
    public peopleInvolved: Person[];
    public summaryOfCauses: SummaryOfCause[];
}