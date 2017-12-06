import { Incident } from "./Incident";
import { Person } from "./Person";

export class AgencyInvolved {
    public id: number;
    public incidentId: number;
    public agency: string;
    public contactingPersonId: number;
    public contactedPersonId: number;
    public dateTime: Date;
    public date: Date;
    public time: Date;
    public details: string;

    public contactingPerson: Person;
    public contactedPerson: Person;
    public incident: Incident;
}