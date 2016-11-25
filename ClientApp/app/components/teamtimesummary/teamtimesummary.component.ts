import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Team } from '../../models/Team';
import { Summary } from '../../models/Summary';

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

	public showSummary: Boolean = true;

	@Input()
	get team() { return this._team }
	set team(team: Team) {
		this._team = team;
		if (this._weekCommencing) this.getSummaries();
	}

	@Input()
	get weekCommencing() { return this._weekCommencing }
	set weekCommencing(weekCommencing: Date) {
		this._weekCommencing = new Date(weekCommencing);
		if (this._team) this.getSummaries();
	}

	getSummaries(): void {
		// Get first and last of month from weekCommencing
		var periodStart = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth(), 1);
		var periodEnd = new Date(this._weekCommencing.getFullYear(), this._weekCommencing.getMonth()+1, 0);

		this.http.get('api/timesheet/summaries/?teamCode=' + this._team.teamCode + '&periodStart=' + this.sqlDate(periodStart)
			+ '&periodEnd=' + this.sqlDate(periodEnd)).subscribe( res => {
				this.summaries = res.json();
				console.log(res.json());
			});
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public sqlDate(date: Date): string {
		return date.toISOString().slice(0, date.toISOString().indexOf("T"));
	}

	toggleSummary(): void {
		this.showSummary = !this.showSummary;
	}
}