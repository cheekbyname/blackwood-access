import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Timesheet } from '../../models/Timesheet';
import { Carer } from '../../models/Carer';
import { Availability } from '../../models/availability';

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

	public combinedAvailability(): Availability[] {
		return this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability).sort(av => { return av.thisStart.valueOf() });
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public formatDate(date: Date): string {
		var dt = new Date(date);
		return dt.toLocaleDateString() + " " + dt.toLocaleTimeString().substr(0, 5); 
	}

	public availHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)
			.map(av => {return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0));
	}

	public bookedHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.bookings
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0));
	}

	public overtimeHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.actualAvailability.filter(av => { av.availCode !== 0})
			.map(av => { return av.thisMins}).reduce((acc, cur) => { return acc + cur}, 0));
	}
}