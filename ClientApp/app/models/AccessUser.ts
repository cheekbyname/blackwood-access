import { AccessUserTeam } from "./AccessUserTeam";

export class AccessUser {
    public id: number;
    public domainUsername: string;
    public accountName: string;
    public isActive: boolean;
    public isAdmin: boolean;
    public isPayrollUser: boolean;
    public defaultTeamCode: number;
    public canAuthoriseAdjustments: boolean;
    public canRejectAdjustments: boolean;
    public isAssessmentUser: boolean;
    public isReportingUser: boolean;

    public emailAddress: string;

    public authorizedTeams: AccessUserTeam[];
}