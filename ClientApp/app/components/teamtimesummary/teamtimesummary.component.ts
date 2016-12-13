import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Http } from '@angular/http';
import { Team } from '../../models/team';
import { Summary } from '../../models/summary';

@Component({
	selector: 'team-summary',
	template: require('./teamtimesummary.component.html'),
	styles: [require('./teamtimesummary.component.css')]
})
export class TeamTimeSummaryComponent {
	constructor(private http: Http) {

	}

	_team: Team;
	summaries: Summary[];
	_weekCommencing: Date;
	months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	public showSummary: Boolean = true;

	@Input()
	get team() { return this._team }
	set team(team: Team) {
		this._team = team;
		if (this._weekCommencing) {
			this.getSummaries();
			this.toggleSummary();
		}
	}

	@Input()
	get weekCommencing() { return this._weekCommencing }
	set weekCommencing(weekCommencing: Date) {
		this._weekCommencing = new Date(weekCommencing);
		if (this._team) this.getSummaries();
	}

	@Output() onSelectedCarer = new EventEmitter<number>();

	getSummaries(): void {
		// Get first and last of month from weekCommencing
		var periodStart = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth(), 1);
		var periodEnd = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth()+1, 0);

		this.http.get('api/timesheet/summaries/?teamCode=' + this._team.teamCode + '&periodStart=' + this.sqlDate(periodStart)
			+ '&periodEnd=' + this.sqlDate(periodEnd)).subscribe( res => {
				this.summaries = res.json();
			});
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
		//return Math.floor(mins/60) + ":" + (mins % 60);
	}

	public displayMonth(): string {
		return this.months[this.weekCommencing.getMonth()] + " " + this.weekCommencing.getFullYear();
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