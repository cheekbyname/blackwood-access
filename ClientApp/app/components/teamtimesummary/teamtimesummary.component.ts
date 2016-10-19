import { Component, Input } from '@angular/core';
import { Team } from '../../models/Team';
import { Carer } from '../../models/Carer';

@Component({
	selector: 'team-summary',
	template: require('./teamtimesummary.component.html'),
	styles: [require('./teamtimesummary.component.css')]
})
export class TeamTimeSummaryComponent {

	_team: Team;
	_carers: Carer[];

	public showSummary: Boolean = true;

	@Input()
	get team() { return this._team }
	set team(team: Team) { this._team = team }

	@Input()
	get carers() { return this._carers }
	set carers(carers: Carer[]) { this._carers = carers }

	toggleSummary(): void {
		this.showSummary = !this.showSummary;
	}
}