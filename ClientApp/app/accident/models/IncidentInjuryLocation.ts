import { Incident } from "./Incident";
import { InjuryLocation } from "./InjuryLocation";

export class IncidentInjuryLocation {
    public id: number;
    public incidentId: number;
    public injuryLocationId: number;
    public otherLocationDetails: string;

    public incident: Incident;
    public injuryLocation: InjuryLocation;
}