import { Team } from "./payroll/Team";

export class AccessUserTeam {
    public id: number;
    public accessUserId: number;
    public teamCode: number;
    public canView: boolean;
    public canAuthorizeExports: boolean;
    public team: Team;

    constructor(userId: number) {
        this.accessUserId = userId;
        this.teamCode = 0;
        this.canView = true;
    }
}