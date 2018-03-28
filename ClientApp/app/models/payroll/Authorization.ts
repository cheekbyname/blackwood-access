import { AccessUser } from "../AccessUser";
import { Export } from "./Export";
import { TeamPeriod } from "./TeamPeriod";

export class Authorization {
    public id: number;
    public teamPeriodId: number;
    public whenAuthorized: Date;
    public authorizingUserId: number;

    public teamPeriod: TeamPeriod;
    public authorizingUser: AccessUser;
    public exports: Export[];

    public authorisedAdditionalHours: number;
}