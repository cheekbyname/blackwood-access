import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';

import { Timesheet } from '../../models/timesheet';
import { Adjustment } from '../../models/adjustment';
import { Locale, LOC_EN } from '../../models/locale';

import { TimesheetProvider } from '../timesheet.provider';

@Component({
    selector: 'timesheet-adjustment',
    template: require('./timesheet.adjustment.component.html'),
	styles: [require('./timesheet.adjustment.component.css')],
    encapsulation: ViewEncapsulation.None
})
export class TimesheetAdjustmentComponent {

    constructor(public timePro: TimesheetProvider, private http: Http) {

    }

    public loc: Locale = LOC_EN;

    private _weekCommencing: Date;
    private _timesheet: Timesheet;
    private _adjustVisible: boolean;
    private _dayOffset: number;

    @Input()
    set weekCommencing(dt: Date) { this._weekCommencing = dt; }
    get weekCommencing(): Date { return this._weekCommencing; }

    @Input()
    set timesheet(ts: Timesheet) { this._timesheet = ts; }
    get timesheet(): Timesheet { return this._timesheet; }

    @Output()
    timesheetChange: EventEmitter<Timesheet> = new EventEmitter<Timesheet>();

    @Input()
    set adjustVisible(vis: boolean) { this._adjustVisible = vis; }
    get adjustVisible(): boolean { return this._adjustVisible;}

    @Output()
    adjustVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set dayOffset(off: number) { this._dayOffset = off; }
    get dayOffset(): number { return this._dayOffset; }

    public totalUnpaidHoursForDay(offset: number): number {
    return this.timesheet.shifts
        .filter(sh => sh.day === offset)
        .map(sh => { return sh.unpaidMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public totalActualHoursForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day == offset)
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc +cur }, 0);
	}

    public minsForAdjustments(): number {
        return this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset)
            .map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public removeAdjust(adjust: Adjustment) {
		// TODO Move this onto Provider
		// TODO Implement confirmation
		var tsUrl = '/api/timesheet/RemoveTimesheetAdjustment?id=' + adjust.id;
		this.http.delete(tsUrl).subscribe(res => {
			this.timesheet.adjustments.splice(this.timesheet.adjustments.indexOf(adjust), 1);
		});
	}

	public closeAdjust(form: NgForm) {
		if (this.checkForm(form)) {
			this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset).forEach((adj) => {
				this.putAdjustment(adj);
			});
			this.adjustVisible = false;
			this.adjustVisibleChange.emit(this._adjustVisible);
			this.timesheetChange.emit(this.timesheet);
		}
	}

	putAdjustment(oldAdj: Adjustment) {
		// TODO Move this onto Provider
		var tsUrl = '/api/timesheet/AddTimesheetAdjustment';
		this.http.put(tsUrl, oldAdj).subscribe((res) => {
			// The (potentially updated) Adjustment returned by the API
			console.log(res.json());
			var newAdj = res.json() as Adjustment;
			// Splice into Timesheet adjustments
			var idx = this.timesheet.adjustments.indexOf(oldAdj);
			this.timesheet.adjustments.splice(idx, 1, newAdj);
		});
	}

	public addAdjust() {
		var newAdj = new Adjustment(this.timesheet.carerCode, this.timesheet.weekCommencing, this.dayOffset);
		if (this.timesheet.contracts.length == 1) newAdj.contractCode = this.timesheet.contracts[0].contractCode;
		this.timesheet.adjustments.push(newAdj);
	}

	public prevDay(form: NgForm) {
		if (this.checkForm(form)) this.dayOffset--;
	}

	public nextDay(form: NgForm) {
		if (this.checkForm(form)) this.dayOffset++;
	}

	public approve(adjust: Adjustment) {

	}

	public reject(adjust: Adjustment) {
		
	}

	public checkForm(form: NgForm): boolean {
		if (form.dirty) {
			alert("Form is dirty");
		}
		return !form.dirty;
	}
}