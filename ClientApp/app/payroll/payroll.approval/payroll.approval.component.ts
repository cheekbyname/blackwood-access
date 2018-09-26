import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ConfirmationService } from "primeng/primeng";

import { AccessUser } from "../../models/AccessUser";
import { CarerValidationItem } from "../../models/payroll/Validation";
import { Summary } from "../../models/payroll/Summary";
import { TeamPeriod } from "../../models/payroll/TeamPeriod";

import { PayrollProvider } from "../payroll.provider";
import { UserProvider } from "../../user.provider";
import { Utils } from "../../Utils";

@Component({
    selector: 'payroll-approval',
    templateUrl: 'payroll.approval.component.html',
    styleUrls: ['payroll.approval.component.css']
})
export class PayrollApprovalComponent {

    currentUser: AccessUser;
    summary: TeamPeriod;
    viewAuth: boolean[] = [];
    Utils = Utils;
    sumAdd: Summary[];

    constructor (public pp: PayrollProvider, private up: UserProvider, private router: Router, private cs: ConfirmationService) {
		this.up.GetUserInfo();
        this.up.userInfo$.subscribe(ui => this.currentUser = ui);
        this.pp.teamPeriod$.subscribe(tp => {
            this.summary = tp;
            if (this.summary !== null)  {
                this.summary.authorizations.sort((a, b) => new Date(a.whenAuthorized) < new Date(b.whenAuthorized) ? 1: 0);
                this.viewAuth.length = this.summary.authorizations.length;
                this.viewAuth.fill(false);
                this.sumAdd = tp.summaries.filter(s => s.actualMins > s.monthlyContractMins);
            }
        });
    }
    
	isAuthable(): boolean {
        return this.validConditions.reduce((a, b) => a && b.fn.call(this), true);
    }
    
	authText(): string {
        var authText = null;
        this.validConditions.forEach(cn => {
            if (!authText && !cn.fn.call(this)) authText = cn.failText;
        });
		return authText || "Approve this summary for Payroll Export";
	}

    // Validation Conditions
    validConditions: {fn: Function, failText: string }[] = [
        { fn: this.summaryLoaded, failText: "Data is still loading, please wait" },
        { fn: this.periodFinished, failText: "This payroll period is not yet finished" },
        { fn: this.userCanAuth, failText: "You are not authorised to authorise this authorisation" },
        { fn: this.noRevisions, failText: "There are issues still to be resolved" }
    ];

    summaryLoaded(): boolean { return !(this.summary === null || this.summary === undefined); }
    periodFinished(): boolean { return this.summary && new Date() >= new Date(this.summary.periodEnd); }
    userCanAuth(): boolean { return this.summary &&  this.currentUser && this.currentUser.authorizedTeams
        .filter(at => at.canAuthorizeExports).map(at => at.teamCode).some(tc => tc == this.summary.teamCode); }
    noRevisions(): boolean { return this.summary && this.invalidOnExport().length === 0; };

    public invalidOnExport(): CarerValidationItem[] {
        var pers = this.summary.currentExports.map(a => a.carer);
        return this.summary.validationResult.carerDataValidationItems.filter(a => pers.some(p => a.carer.carerCode === p.carerCode));
    }

    toggleExportView(idx: number) {
        var tog = !this.viewAuth[idx];
        this.viewAuth.fill(false);
        this.viewAuth[idx] = tog;
    }

    approveSummary(): void {
        // Confirmation of approvals
        this.cs.confirm({
            message: `Are you sure you want to ${this.summary.authorizations.length > 0 ? 're-': ''}approve this payroll period?`,
            accept: () => {
                this.pp.putApproval(this.summary);
            }
        });
    }

    public clearDetail() {
        this.router.navigate(['/payroll', this.summary.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.summary.teamCode] }}]);
	}

    public displayDateAndTime(when: string): string {
        var dt: Date = new Date(when);
        return `${dt.toLocaleDateString('en-gb')} ${dt.toLocaleTimeString()}`;
    }

    public displayDate(when: string): string {
        var dt: Date = new Date(when);
        return `${dt.toLocaleDateString('en-gb')}`;
    }

    public currentHours(): number {
        return this.summary.summaries.map(sum => this.additionalHours(sum)).reduce((cur, acc) => { return cur + acc } , 0);
    }

    private additionalHours(sum): number {
		var calcHours = sum.actualMins - sum.unpaidMins - sum.monthlyContractMins;
		return calcHours < 0 ? 0 : calcHours;
    }
    
    private authNotice() {
        var cAuth = this.summary.currentAuth;
        var dtAuth = new Date(cAuth.whenAuthorized);
        var dtExpo = new Date(this.summary.whenExported);

        var exportPhrase = this.summary.whenExported == null ? `and is waiting to be exported`
            : `and was exported on ${dtExpo.toLocaleDateString()} at ${dtExpo.toLocaleTimeString()}`;

        return `This payroll period was approved by ${cAuth.authorizingUser.accountName} on `
        + `${dtAuth.toLocaleDateString()} at ${dtAuth.toLocaleTimeString()} `
        + exportPhrase;
    }
}