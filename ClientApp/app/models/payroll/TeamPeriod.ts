import { Adjustment } from "./Adjustment";
import { Authorization } from "./Authorization";
import { Carer } from "./Carer";
import { Export } from "./Export";
import { Summary } from "./Summary";
import { Team } from "./Team";
import { ValidationResult } from "./Validation";

export class TeamPeriod {
    public id: number;
    public teamCode: number;
    public periodStart: any;
    public periodEnd: any;
    public whenExported: Date;

    public team: Team;
    public carers: Carer[];
    public summaries: Summary[];
    public exports: Export[];
    public adjustments: Adjustment[];
    public validationResult: ValidationResult;
    public authorizations: Authorization[];
    public validationMessages: {}[];

    public isAuthorized: boolean;
    public isExported: boolean;

    constructor(teamCode: number, periodStart: string, periodEnd: string) {
        this.teamCode = teamCode;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
    }
}