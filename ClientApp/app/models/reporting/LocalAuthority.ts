import { Service } from "./Service";
import { Team } from "../payroll/Team";
import { Schedule } from "./Schedule";

export class LocalAuthority {
    public ref: string;
    public name: string;
    public serviceId: number;

    public service: Service;
    public teams: Team[];

    public schedules: Schedule[];
}