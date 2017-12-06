import { Incident } from "./Incident";
import { Involvement } from "./Involvement";
import { Person } from "./Person";
import { YesNoMaybe } from "./YesNoMaybe";

export class PersonInvolved {
    public id: number;
    public incidentId: number;
    public involvementId: number;
    public personId: number;
    public otherDetails: string;
    public ableToResumeId: number;
    public sentHomeId: number;
    public sentHospitalId: number;
    public medicalAttentionRequiredId: number;
    public daysAbsent: number;
    public natureOfInjuryDetails: string;
    public treatmentGivenDetails: string;

    public incident: Incident;
    public involvement: Involvement;
    public person: Person;
    public wasAbleToResumeWork: YesNoMaybe;
    public wasSentHome: YesNoMaybe;
    public wasSentToHospital: YesNoMaybe;
    public wasMedicalAttentionRequired: YesNoMaybe;
}