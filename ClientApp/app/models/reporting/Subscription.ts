import { Schedule } from "./Schedule";
import { AccessUser } from "../AccessUser";

export class Subscription {
    public id: number;
    public scheduleId: number;
    public accessUserId: number;
    public emailAddress: string;

    public schedule: Schedule;
    public accessUser: AccessUser;

    constructor(sched: Schedule, user: AccessUser) {
        this.schedule = sched;
        this.accessUser = user;
        this.scheduleId = sched.id;
        this.accessUserId = user.id;
        this.emailAddress = user.emailAddress;
    }
}