import { Schedule } from "./Schedule";

export class Subscription {
    public id: number;
    public scheduleId: number;
    public emailAddress: string;

    public schedule: Schedule;
}