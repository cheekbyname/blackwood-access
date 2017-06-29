import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

import { Team } from '../../models/team';
import { Summary } from '../../models/summary';
import { Locale, LOC_EN} from '../../models/locale';

import { TimesheetProvider } from '../timesheet.provider';

@Component({
	selector: 'team-summary',
	template: require('./teamtimesummary.component.html'),
	styles: [require('./teamtimesummary.component.css')]
})
export class TeamTimeSummaryComponent {

	constructor(private http: Http, private timePro: TimesheetProvider) {
		this.setPeriod(new Date(Date.now()));
	}

	loc: Locale = LOC_EN;
	_team: Team;
	summaries: Summary[];
	// _weekCommencing: Date;	// TODO Can we remove this from summary - doesn't feel like it belongs here
	periodStart: Date;
	periodFinish: Date;

	public showSummary: Boolean = true;

	@Input()
	get team() { return this._team }
	set team(team: Team) {
		this._team = team;
		// if (this._weekCommencing) {
		this.getSummaries();
		this.showSummary = true;
		// }
	}

	// @Input()
	// get weekCommencing() { return this._weekCommencing }
	// set weekCommencing(weekCommencing: Date) {
	// 	this._weekCommencing = new Date(weekCommencing);
	// 	if (this._team) this.getSummaries();
	// }

	@Output() onSelectedCarer = new EventEmitter<number>();

	periodStartSelected(ev: Event) {
		this.getSummaries();
	}

	periodFinishSelected(ev: Event) {
		this.getSummaries();
	}

	setPeriod(dt: Date) {
		// Get first and last of month from a selected date
		this.periodStart = new Date(dt.getFullYear(), dt.getMonth(), 1);
		this.periodFinish = new Date(dt.getFullYear(), dt.getMonth()+1, 0);
	}

	getSummaries(): void {
		if (this.periodStart != undefined && this.periodFinish != undefined) {
			this.summaries = undefined;
			this.http.get('api/timesheet/summaries/?teamCode=' + this._team.teamCode
				+ '&periodStart=' + this.sqlDate(this.periodStart)
				+ '&periodEnd=' + this.sqlDate(this.periodFinish)).subscribe( res => {
					this.summaries = res.json();
				console.log(this.summaries);
			});
		}
		// Get first and last of month from a selected date
		// this.periodStart = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth(), 1);
		// this.periodFinish = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth()+1, 0);

		// TODO Move this onto provider
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
		//return Math.floor(mins/60) + ":" + (mins % 60);
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

	selectCarer(sum: Summary): void {
		this.onSelectedCarer.emit(sum.carerCode);
		this.toggleSummary();
	}
}