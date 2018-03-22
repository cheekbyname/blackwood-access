import { AccessUser } from "../AccessUser";
import { TeamPeriod } from "./TeamPeriod";

export class Authorization {
    public id: number;
    public teamPeriodId: number;
    public whenAuthorized: Date;
    public authorizingUserId: number;

    public teamPeriod: TeamPeriod;
    public authorizingUser: AccessUser;
}