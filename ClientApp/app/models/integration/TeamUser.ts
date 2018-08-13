import { Team } from "../payroll/Team";
import { User } from "./User";

export class TeamUser {
    public teamCode: number;
    public teamDesc: string;
    public teamEnabled: boolean;
    public userID: number;
    public personCode: number;
    public firstName: string;
    public lastName: string;
    public role: string;
    public userEnabled: boolean;
    public userNotified: boolean;
    public primaryContact: string;
    public automatic: boolean;

    public team: Team;
    public user: User;
}