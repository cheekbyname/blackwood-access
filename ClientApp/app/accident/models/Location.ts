import { Incident } from "./Incident";
import { Region } from "./Region";
import { UserUnit } from "./UserUnit";

export class Location {
    public id: number;
    public description: string;
    public isActive: boolean;
    public address2: string;
    public address3: string;
    public postCode: string;
    public regionId: number;

    public region: Region;

    public incidentsAtLocation: Incident[];
    public incidentsReportedToLocation: Incident[];
    public userUnits: UserUnit[];
}