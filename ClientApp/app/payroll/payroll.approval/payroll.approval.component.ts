import { Component } from "@angular/core";

import { AccessUser } from "../../models/AccessUser";
import { Router } from "@angular/router";
import { Team } from "../../models/payroll/Team";
import { TeamPeriod } from "../../models/payroll/TeamPeriod";

import { PayrollProvider } from "../payroll.provider";
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'payroll-approval',
    templateUrl: 'payroll.approval.component.html',
    styleUrls: ['payroll.approval.component.css']
})
export class PayrollApprovalComponent {

    currentUser: AccessUser;
    summary: TeamPeriod;

    constructor (private payPro: PayrollProvider, private userPro: UserProvider, private router: Router) {
		this.userPro.GetUserInfo();
        this.userPro.userInfo$.subscribe(ui => {
            this.currentUser = ui;
            console.log(ui);
        });
        this.payPro.teamPeriod$.subscribe(tp => {
            this.summary = tp;
            console.log(tp);
        });
    }
    
	isAuthorized(): boolean {
		// TODO Add condition to prevent approval while data is still loading
		return this.summary && new Date() >= new Date(this.summary.periodEnd) && this.currentUser && this.currentUser.authorizedTeams
			.filter(at => at.canAuthorizeExports).map(at => at.teamCode).some(tc => tc == this.summary.teamCode);
	}

	authText(): string {
		// TODO Add message indicating that approval requires data to be loaded
		return this.summary ? new Date() < new Date(this.summary.periodEnd) ? "This payroll period is not yet finished!" :
            this.isAuthorized() ? "Approve this summary for Payroll Export" : "You are not authorised to authorise this authorisation"
            : "Data is still loading, please wait";
	}

    approveSummary(): void {
        this.payPro.putApproval(this.summary.teamCode, this.summary.periodStart, this.summary.periodEnd);
    }

    public clearDetail() {
        this.router.navigate(['/payroll', this.summary.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.summary.teamCode] }}]);
	}

}