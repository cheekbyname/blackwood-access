import { InjuryLocation } from "./InjuryLocation";
import { Person } from "./Person";

export class PersonalInjuryLocation {
    public id: number;
    public personInvolvedId: number;
    public injuryLocationId: number;
    public otherInjuryLocationDetails: string;

    public personInvolved: Person;
    public injuryLocation: InjuryLocation;
}