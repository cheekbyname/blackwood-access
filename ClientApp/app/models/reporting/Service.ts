import { Region } from "./Region";
import { Schedule } from "./Schedule";

export class Service {
    public id: number;
    public name: string;
    public regionId: number;

    public region: Region;
    public schedules: Schedule[];
}