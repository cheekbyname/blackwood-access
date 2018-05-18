import { Team } from "./payroll/Team";

export class AccessUserTeam {
    public id: number;
    public accessUserId: number;
    public teamCode: number;
    public canView: boolean;
    public canAuthorizeExports: boolean;
    public canAuthorizeAdjustments: boolean;
    public canRejectAdjustments: boolean;

    public team: Team;

    constructor(userId: number) {
        this.accessUserId = userId;
        this.teamCode = 0;
        this.canView = true;
    }

    public static Controls(at: AccessUserTeam) {
        return {
            id: [at.id],
            accessUserId: [at.accessUserId],
            teamCode: [at.teamCode],
            canView: [at.canView],
            canAuthorizeExports: [at.canAuthorizeExports],
            canAuthorizeAdjustments: [at.canAuthorizeAdjustments],
            canRejectAdjustments: [at.canRejectAdjustments]
        }
    }
}