import { AccidentUser } from "./AccidentUser";
import { AgencyInvolved } from "./AgencyInvolved";
import { Gender } from "./Gender";
import { Incident } from "./Incident";
import { Involvement } from "./Involvement";
import { PersonalInjuryLocation } from "./PersonalInjuryLocation";
import { Role } from "./Role";

export class Person {
    public id: number;
    public displayName: string;
    public genderId: number;
    public age: number;
    public roleId: number;
    public otherRole: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public postCode: string;

    public accidentUser: AccidentUser;
    public gender: Gender;
    public role: Role;

    public contactingAgencies: AgencyInvolved[];
    public contactedAgencies: AgencyInvolved[];
    public personInvolvedIncidents: Incident[];
    public personCompletingFormIncidents: Incident[];
    public personFirstReportedToIncidents: Incident[];
    public personalInjuryLocations: PersonalInjuryLocation[];
    public involvements: Involvement[];
}