import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from "primeng/primeng";

import { AccessUser } from "../../models/AccessUser";
import { Adjustment } from '../../models/payroll/Adjustment';
import { Locale, LOC_EN } from '../../models/Locale';
import { BreakPolicy } from "../../models/payroll/BreakPolicy";
import { Timesheet } from '../../models/payroll/Timesheet';
import { Shift } from "../../models/payroll/shift";

import { PayrollProvider } from '../payroll.provider';
import { UserProvider } from '../../user.provider';
import { ToilSetting } from '../../models/payroll/PayrollCodeMap';

@Component({
	selector: 'timesheet-adjustment',
	templateUrl: './timesheet.adjustment.component.html',
	styleUrls: ['./timesheet.adjustment.component.css']
})
export class TimesheetAdjustmentComponent {

	constructor(public pp: PayrollProvider, private http: Http, private conServ: ConfirmationService,
		private userPro: UserProvider) {
		this.userPro.GetUserInfo().then(ui => this.user = ui);
	}

	public loc: Locale = LOC_EN;
	public ToilSetting = ToilSetting;

	private _weekCommencing: Date;
	private _timesheet: Timesheet;
	private _adjustVisible: boolean;
	private _dayOffset: number;
	private user: AccessUser;

	public breakInfoVisible: boolean = false;
	public shiftBreakPolicy: BreakPolicy;

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
	get adjustVisible(): boolean { return this._adjustVisible; }

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
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public totalToilMinsForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day == offset)
			.map(sh => { return this.toilDelta(sh) })
			.reduce((acc, cur) => { return acc + cur }, 0);
	}

	private toilDelta(shift: Shift): number {
		if (shift.availabilityType.toil == ToilSetting.Increment) return shift.shiftMins - shift.unpaidMins;
		return shift.bookings
			.filter(bk => bk.toil == ToilSetting.Decrement)
			.map(bk => { return bk.thisMins })
			.reduce((acc, cur) => { return acc - cur }, 0);
	}

	public minsForAdjustments(): number {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset && adj.rejected == null)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public removeAdjust(adjust: Adjustment) {
		// TODO Move API call onto Provider
		// TODO Guard on what condition?
		this.conServ.confirm({
			message: 'Are you sure you want to remove this adjustment?',
			accept: () => {
				var tsUrl = '/api/payroll/RemoveTimesheetAdjustment?id=' + adjust.id;
				this.http.delete(tsUrl).subscribe(res => {
					this.timesheet.adjustments.splice(this.timesheet.adjustments.indexOf(adjust), 1);
				});
			}
		});
	}

	public closeAdjust(form: NgForm) {
		if (!this.isValid(form)) {
			this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset).forEach((adj) => {
				this.putAdjustment(adj);
			});
		}
		this.adjustVisible = false;
		this.adjustVisibleChange.emit(this._adjustVisible);
		this.timesheetChange.emit(this.timesheet);
	}

	putAdjustment(oldAdj: Adjustment) {
		// TODO Guard on what condition?
		this.pp.putAdjustment(oldAdj).then((newAdj) => {
			var idx = this.timesheet.adjustments.indexOf(oldAdj);
			this.timesheet.adjustments.splice(idx, 1, newAdj);
		});
	}

	public addAdjust() {
		// TODO Guard on what condition?
		var newAdjust = new Adjustment(this.timesheet.carerCode, this.timesheet.weekCommencing, this.dayOffset);

		// Automatically assign CarerContract if only one for this timesheet
		if (this.timesheet.contracts.length == 1) newAdjust.contractCode = this.timesheet.contracts[0].contractCode;

		// Automatically Approve if user adding has authority to do so
		if (this.user.canAuthoriseAdjustments) this.approve(newAdjust, false).then(res => newAdjust = res);

		this.timesheet.adjustments.push(newAdjust);
	}

	public prevDay(form: NgForm) {
		if (this.isValid(form)) this.dayOffset--;
	}

	public nextDay(form: NgForm) {
		if (this.isValid(form)) this.dayOffset++;
	}

	public approve(adjust: Adjustment, sendNow: boolean): Promise<Adjustment> {
		if (this.user.canAuthoriseAdjustments) {
			return this.pp.approveAdjustment(adjust, sendNow);
		} else {
			alert("You are not authorised to approve timesheet adjustments");
		}
	}

	public reject(adjust: Adjustment) {
		if (this.user.canRejectAdjustments) {
			this.pp.rejectAdjustment(adjust);
		} else {
			alert("You are not authorised to reject timesheet adjustments");
		}
	}

	public isValid(form: NgForm): boolean {
		var valid = !form.dirty; // && any other clauses we need to cover
		return valid;
	}

	public showBreakPolicyInfo(shift: Shift) {
		if (!shift.validBreak) {
			this.shiftBreakPolicy = this.timesheet.breakPolicies.find(bp => bp.id == shift.breakPolicyId);
			this.shiftBreakPolicy.definitions = this.timesheet.breakDefinitions
				.filter(bd => bd.breakPolicyId == this.shiftBreakPolicy.id
					&& shift.shiftMins >= bd.minThreshold && (shift.shiftMins <= bd.maxThreshold || bd.maxThreshold == null));
			// TODO Add filter clause for valid dates
			this.breakInfoVisible = true;
		}
	}

	public dismissBreakPolicyInfo() {
		this.breakInfoVisible = false;
	}

	public validTip(shift: Shift): string {
		return !shift.validBreak ? 'There are insufficient breaks in this shift. Click for more information.' : '';
	}
}