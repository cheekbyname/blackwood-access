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

	@Input() set weekCommencing(weekCommencing: Date) {
		this._weekCommencing = weekCommencing;
	}
	get weekCommencing() { return this._weekCommencing }

	@Input() set carer(carer: Carer) {
		this._carer = carer;
		this.http.get('/api/timesheet/timesheet?carerCode=' + this._carer.carerCode + '&weekCommencing=' + this._weekCommencing).subscribe(res => {
            this.timesheet = res.json();
            console.log(this.timesheet);
        });
	}
	get carer() { return this._carer }
}