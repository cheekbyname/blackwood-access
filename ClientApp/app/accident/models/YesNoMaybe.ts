import { Incident } from "./Incident";
import { PersonInvolved } from "./PersonInvolved";

export class YesNoMaybe {
    public id: number;
    public desc: string;

    public wasAbleToResumeWorkIncidents: Incident[];
    public wasSentHomeIncidents: Incident[];
    public wasSentToHospitalIncidents: Incident[];
    public wasMedicalAttentionRequiredIncidents: Incident[];
    public wasRiskAssessInPlaceIncidents: Incident[];
    public hasRiskAssessBeenReviewedIncidents: Incident[];
    public isNewRiskAssessBeingIntroducedIncidents: Incident[];
    public hasCareManagerBeenInformedIncidents: Incident[];
    public WasAbleToResumeWorkInvolvements: PersonInvolved[];
    public wasSentHomeInvolvements: PersonInvolved[];
    public wasSentToHospitalInvolvements: PersonInvolved[];
    public wasMedicalAttentionRequiredInvolvements: PersonInvolved[];
}