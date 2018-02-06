import { Schedule } from "./Schedule";
import { Service } from "./Service";

export class ReportingRegion {
    public id: number;
    public name: string;

    public services: Service[];
    public schedules: Schedule[];
}