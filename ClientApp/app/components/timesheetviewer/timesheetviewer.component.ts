import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Timesheet } from '../../models/Timesheet';
import { Carer } from '../../models/Carer';

@Component({
	selector: 'timesheetviewer',
	template: require('./timesheetviewer.component.html'),
	styles: [require('./timesheetviewer.component.css')]
})
export class TimesheetViewerComponent {

	constructor(http: Http) {
		this.http = http;
	}

	_carer: Carer;
	_weekCommencing: Date;
	http: Http;
	timesheet: Timesheet;

	@Input()
	set weekCommencing(weekCommencing: Date) {
		this._weekCommencing = weekCommencing;
		if (this._carer) this.getTimesheet();
	}
	get weekCommencing() { return this._weekCommencing }

	@Input()
	set carer(carer: Carer) {
		this._carer = carer;
		if (this._weekCommencing) this.getTimesheet();
	}
	get carer() { return this._carer }

	getTimesheet(): void {
		this.http.get('/api/timesheet/timesheet?carerCode=' + this._carer.carerCode + '&weekCommencing=' + this._weekCommencing).subscribe(res => {
            this.timesheet = res.json();
            console.log(this.timesheet);
        });
	}

	public timeDisplay(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public availHoursForContract(contractCode: number): string {
		return this.timeDisplay(this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)
			.map(ava => {return ava.thisMins}).reduce((acc, cur) => { return acc + cur }));
	}
}