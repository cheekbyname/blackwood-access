import { AccessUserTeam } from "./AccessUserTeam";

export class AccessUser {
    public id: number = 0;
    public accountName: string;
    public isActive: boolean = true;
    public isAdmin: boolean;
    public isPayrollUser: boolean;
    public defaultTeamCode: number;
    public canAuthoriseAdjustments: boolean;
    public canRejectAdjustments: boolean;
    public isAssessmentUser: boolean;
    public isReportingUser: boolean;
    public isAccidentUser: boolean;
    public isIntegrationUser: boolean;

    public emailAddress: string;
    public domainUsername: string;

    public authorizedTeams: AccessUserTeam[] = [];
}