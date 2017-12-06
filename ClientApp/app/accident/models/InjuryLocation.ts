import { IncidentInjuryLocation } from "./IncidentInjuryLocation";
import { PersonalInjuryLocation } from "./PersonalInjuryLocation";

export class InjuryLocation {
    public id: number;
    public description: string;
    public order: number;

    public incidentInjuryLocations: IncidentInjuryLocation[];
    public personalInjuryLocations: PersonalInjuryLocation[];
}