import { Person } from "./Person";
import { UserUnit } from "./UserUnit";

export class AccidentUser {
    public id: number;
    public accountName: string;
    public displayName: string;
    public personId: number;
    public isAdmin: boolean;
    public isManager: boolean;
    public isOfficer: boolean;
    public lastLogin: Date;

    public person: Person;
    public userUnits: UserUnit[];
}