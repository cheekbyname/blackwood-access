import { ReportingRegion } from "./ReportingRegion";
import { Schedule } from "./Schedule";

export class Service {
    public id: number;
    public name: string;
    public regionId: number;

    public region: ReportingRegion;
    public schedules: Schedule[];
}