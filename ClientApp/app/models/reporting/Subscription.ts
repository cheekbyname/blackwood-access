import { Schedule } from "./Schedule";
import { AccessUser } from "../AccessUser";

export class Subscription {
    public id: number;
    public scheduleId: number;
    public accessUserId: number;
    public emailAddress: string;

    public schedule: Schedule;
    public accessUser: AccessUser;
}