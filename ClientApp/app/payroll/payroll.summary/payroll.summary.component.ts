import { Component, EventEmitter, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from "rxjs/Rx";

import { AccessUser } from '../../models/AccessUser';
import { Locale, LOC_EN} from '../../models/Locale';
import { Summary } from '../../models/payroll/Summary';
import { Team } from '../../models/payroll/Team';

import { PayrollProvider } from '../payroll.provider';
import { UserProvider } from '../../user.provider';

@Component({
	selector: 'team-summary',
	templateUrl: './payroll.summary.component.html',
    styleUrls: ['./payroll.summary.component.css']
})
export class PayrollSummaryComponent implements OnInit {

	ngOnInit() {
		this.route.params.subscribe((p) => {
			if (p['teamCode'] != undefined) {
				this.payPro.teams$.subscribe((teams) => {
					if (teams != null) {
						var team = teams.find(t => t.teamCode == p['teamCode']);
						this.team = team;
						this.payPro.selectTeam(team);	// TODO Works, but shouldn't it be on ManagerComponent?
					}
				});
			}
		});
		this.payPro.periodStart$.subscribe(start => this.periodStart = start);
		this.payPro.periodFinish$.subscribe(finish => this.periodFinish = finish);
		this.payPro.summaries$
			.catch(err => {
				this.error = err;
				return Observable.of<Summary[]>([]);
			})
            .subscribe(sums => this.summaries = sums);
		this.payPro.weekCommencing$.subscribe(wc => this.weekCommencing = wc);
		// this.payPro.errorMessage$.subscribe(err => {
		// 	if(err != undefined) this.errored = true;
		// });
	}

	constructor(private http: Http, private payPro: PayrollProvider, private router: Router, private route: ActivatedRoute,
		private userPro: UserProvider) {
		this.payPro.setPeriod(new Date(Date.now()));
		this.userPro.GetUserInfo();
		this.userPro.userInfo$.subscribe(ui => this.currentUser = ui);
	}

	loc: Locale = LOC_EN;
	_team: Team;
	summaries: Summary[];
	periodStart: Date;
	periodFinish: Date;
	weekCommencing: Date;	// For navigation
	error: any = undefined;
	currentUser: AccessUser;

	public showSummary: Boolean = true;

	//@Input()
	get team() { return this._team }
	set team(team: Team) {
		this._team = team;
		this.showSummary = true;
	}

	@Output() onSelectedCarer = new EventEmitter<number>();

	periodStartSelected(ev: Event) {
		this.payPro.setPeriodStart(this.periodStart);
	}

	periodFinishSelected(ev: Event) {
		this.payPro.setPeriodFinish(this.periodFinish);
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public displayMonth(): string {
		return this.loc.monthNames[this.periodStart.getMonth()] + " " + this.periodStart.getFullYear();
	}

	public displayPercent(num: number, den: number): string {
		if (num === 0) return "0.00%";
		if (den === 0) return "N/A";
		return (num / den * 100).toFixed(2) + "%";
	}

	public sqlDate(date: Date): string {
		return date.toISOString().slice(0, date.toISOString().indexOf("T"));
	}

	toggleSummary(): void {
		this.showSummary = !this.showSummary;
	}

	isAuthorized(): boolean {
		return new Date() >= this.periodFinish && this.currentUser && this.currentUser.authorizedTeams
			.filter(at => at.canAuthorizeExports).map(at => at.teamCode).some(tc => tc == this.team.teamCode);
	}

	authText(): string {
		return new Date() < this.periodFinish ? "This payroll period is not yet finished!" :
			this.isAuthorized() ? "Approve this summary for Payroll Export" : "You are not authorised to authorise this authorisation";
	}

    approveSummary(): void {
        this.payPro.putApproval(this.team.teamCode, this.periodStart, this.periodFinish);
    }

	selectCarer(sum: Summary): void {
		this.showSummary = false;

		var navDate = this.weekCommencing >= this.periodStart && this.weekCommencing <= this.periodFinish
			? this.weekCommencing : this.payPro.getWeekCommencingFromDate(this.periodFinish);

			this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: {
				detail: ['timesheet', {
					carer: sum.carerCode,
					week: this.payPro.sqlDate(navDate)
				}],
				summary: ['summary', this.team.teamCode]
			}
		}]);
	}

	showReview() {
		this.showSummary = false;
		this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: { detail: ['review', this.team.teamCode], summary: ['summary', this.team.teamCode] }}]);
    }

	showExport() {
		this.showSummary = false;
		this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: { detail: ['export', this.team.teamCode], summary: ['summary', this.team.teamCode] }}]);
	}

    public additionalHours(sum: Summary): number {
		let sumMins = sum.actualMins - sum.unpaidMins - sum.monthlyContractMins;
        return sumMins < 0 ? 0 : sumMins;
    }
}