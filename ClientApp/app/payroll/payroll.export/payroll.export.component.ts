import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router, Route } from "@angular/router";

import { DataTableModule, SharedModule } from "primeng/primeng";

import { Payroll } from "../../models/Payroll";
import { Team } from "../../models/Team";

import { PayrollProvider } from "../payroll.provider";

@Component({
    templateUrl: './payroll.export.component.html',
    styleUrls: ['./payroll.export.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PayrollExportComponent {
    @ViewChild('dt') dt;

    export: Payroll[];
    team: Team;
    // periodStart: Date;
    // periodFinish: Date;
    fileName: string;

    constructor(public payPro: PayrollProvider, private router: Router) {
        this.payPro.export$.subscribe(exp => this.export = exp);
        this.payPro.selectedTeam$.subscribe(tm => this.team = tm);
        // this.payPro.periodStart$.subscribe(ps => this.periodStart = ps);
        // this.payPro.periodFinish$.subscribe(pf => this.periodFinish = pf);
        this.payPro.periodObserver$.subscribe(p => {
            if (p.team && p.start !== null) this.fileName = `payroll-${p.team.teamCode}-${this.payPro.sqlDate(p.start)}`;
        });
    }

    public clearDetail() {
        this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.team.teamCode] }}]);
	}

}