import { Location } from "./Location";
import { Person } from "./Person";

export class IncidentSummary {
    public id: number;
    public incidentDetails: string;
    public locationName: string;
    public personInvolvedName: string;
    public user: string;
    public dateAndTime: Date;

    public location: Location;
    public person: Person;
}