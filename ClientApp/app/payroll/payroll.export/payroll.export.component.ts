import { Component } from "@angular/core";

import { DataTableModule, SharedModule } from "primeng/primeng";

import { Payroll } from "../../models/payroll";
import { Team } from "../../models/team";

import { PayrollProvider } from "../payroll.provider";

@Component({
    template: require('./payroll.export.component.html'),
    styles: [require('./payroll.export.component.css')]
})
export class PayrollExportComponent {

    export: Payroll[];
    team: Team;
    periodStart: Date;
    periodFinish: Date;
    fileName: string;

    constructor(public payPro: PayrollProvider) {
        this.payPro.export$.subscribe(exp => {
            this.export = exp;
            if (this.team) {
                this.fileName = `payroll-${this.team.teamCode}-${this.payPro.sqlDate(this.periodStart)}`;
            }
        });
        this.payPro.selectedTeam$.subscribe(tm => this.team = tm);
        this.payPro.periodStart$.subscribe(ps => this.periodStart = ps);
        this.payPro.periodFinish$.subscribe(pf => this.periodFinish = pf);
    }
}