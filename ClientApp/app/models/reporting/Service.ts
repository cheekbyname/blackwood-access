import { LocalAuthority } from "./LocalAuthority";
import { Region } from "./Region";
import { Schedule } from "./Schedule";
import { Team } from "../payroll/Team";

export class Service {
    public id: number;
    public name: string;
    public regionId: number;

    public region: Region;
    public schedules: Schedule[];

    public localAuthorities: LocalAuthority[];

    // Deprecated, to be removed in due course
    public teams: Team[];
}