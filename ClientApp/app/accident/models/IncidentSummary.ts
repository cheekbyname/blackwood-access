import { Location } from "./Location";
import { Person } from "./Person";

export class IncidentSummary {
    public id: number;
    public incidentDetails: string;
    public locationId: number;
    public personId: number;

    public location: Location;
    public person: Person;
}