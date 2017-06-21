import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { BookingCardComponent } from '../cards/booking.card/booking.card';
import { Timesheet } from '../../models/timesheet';
import { CarerBooking } from '../../models/booking';
import { Carer } from '../../models/carer';
import { Availability } from '../../models/availability';
import { Shift } from '../../models/shift';
import { Adjustment } from '../../models/adjustment';

import { DialogModule, Header, Footer, SpinnerModule } from 'primeng/primeng';

type BookingGrid = Array<Array<CarerBooking>>;

@Component({
	selector: 'timesheet-viewer',
	template: require('./timesheetviewer.component.html'),
	styles: [require('./timesheetviewer.component.css')]
})
export class TimesheetViewerComponent implements OnInit {

	constructor(http: Http) {
		this.http = http;
	}

	ngOnInit(): void {
		this.bookings = this.emptyBook();
	}

    private absenceCodes: number [] = [108, 109, 123];

	_carer: Carer;
	_weekCommencing: Date;
	http: Http;
	timesheet: Timesheet;
	bookings: BookingGrid;
	isContracted: boolean;

	adjustVisible: boolean = false;
	adjustDate: number;
	adjustDay: string;
	adjustShifts: Shift[];
	adjustments: Adjustment[] = new Array<Adjustment>();

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
		// TODO This should really be on the provider
		var tsUrl = '/api/timesheet/timesheet?carerCode=' + this._carer.carerCode + '&weekCommencing=' + this._weekCommencing;
		this.http.get(tsUrl).subscribe(res => this.processTimesheet(res));
	}

	processTimesheet(res): void {
		this.bookings = this.emptyBook();
		var ts: Timesheet = res.json();
		this.timesheet = ts;
		console.log(this.timesheet);
		ts.bookings.forEach(bk => this.stuffBook(bk));
		this.transBook();
		this.isContracted = ts.contracts.some(cn => { return cn.contractMins > 0 });
		document.getElementsByTagName("timesheet-viewer")[0].scrollIntoView();
	}

	emptyBook() {
		return [[],[],[],[],[],[],[]];
	};

	stuffBook(bk: CarerBooking): void {
		// Because we want whole days and valueOf returns milliseconds
		var offset = Math.floor((new Date(bk.thisStart).valueOf() - new Date(this.weekCommencing).valueOf()) / (1000 * 60 * 60 * 24));
		offset = offset < 0 ? 0 : offset;
		this.bookings[offset].push(bk);
	}

	// Transpose Bookings array
	transBook(): void {
		var bks = this.bookings;
		var len = Math.max(...bks.map(ar => { return ar.length }));					// Get max width of matrix
		if (len-bks.length > 0) bks = bks.concat(Array(len-bks.length).fill([]));	// Pad to square
		bks = bks.map((x, y) => bks.map(x => x[y]));								// Transpose array
		//bks = this.chronOrder(bks);													// Shift down to make some chronological sense
		this.bookings = bks.filter((x: [any]) => x.some(e => e !== undefined)); 	// Strip blank rows
	}

	// Display BookingGrid in rough chronological order by sliding Bookings down if they start after another on the same row finishes
	chronOrder(bookings: BookingGrid): BookingGrid {
		var row = 0;
		while (row < bookings.length - 1) {
			var min = bookings[row].map(booking => { if (booking === undefined) {
					return 9 } else { return booking.shift }
				}).reduce((cur, min) => { return min < cur ? min : cur; }, 9);
			bookings[row].forEach((booking) => {
				if (booking !== undefined && booking.shift > min) {
					var col = bookings[row].indexOf(booking);
					if (bookings[bookings.length - 1][col] !== undefined) { bookings.push(Array(7)) };
					for (var i = bookings.length - 1; i > row ; i--) {
						bookings[i][col] = bookings[i-1][col];
					}
					bookings[row][col] = undefined;
				}
			});
			row++;
		}
		return bookings;
	}

	public combinedAvailability(): Availability[] {
		return (this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)).sort(av => { return av.thisStart.valueOf() });
	}

	public displayTime(mins: number): string {
		if (mins < 0) {
			return Math.ceil(mins/60) + "h " + (mins % 60) + "m";
		}
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

    public timeFromDate(dt: string): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }

	public formatDate(date: Date): string {
		var dt = new Date(date);
		return dt.toLocaleDateString() + " " + dt.toLocaleTimeString().substr(0, 5); 
	}

	public displayDate(date: Date): string {
		return new Date(date).toLocaleDateString();
	}

	public availHoursForContract(contractCode: number): number {
		return this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)
			.filter(av => av.contractCode === contractCode)
			.map(av => {return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public bookedHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode)
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public actualHoursForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day === offset)
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0) + this.minsAdjustOffset(offset);
	}

	public actualHoursForContract(contractCode: number): number {
		// TODO Filter by Contract once we figure out what to do regarding possible multi-contract shifts
		return this.timesheet.bookings.filter(bk => bk.contractCode === contractCode)
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0 );
	}

	public additionalHoursForContract(contractCode: number): number {
		var overMins = this.actualHoursForContract(contractCode)
			- this.timesheet.contracts.find(cn => cn.contractCode === contractCode).contractMins;
		return overMins < 0 ? 0 : overMins;

		// return this.timesheet.actualAvailability
		// 	.filter(av => { av.availCode !== 0 && av.contractCode === contractCode})
		// 	.map(av => { return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public leaveSickHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode && this.absenceCodes.some(ac => ac === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	// public bookingSlot(offset: number): CarerBooking[] {
	// 	var bookSlot = CarerBooking[7];
	// 	for (var i=0; i<7; i++) {

	// 	}
	// 	return bookSlot;
	// }

	public dateOrd(offset: number): string {
		var dt = new Date(this.weekCommencing);
		dt.setDate(dt.getDate() + offset);
		var dy = dt.getDate().toString();
		switch (dy.substr(dy.length - 1)) {
			case "1":
				return dy + "st";
			case "2":
				return dy + "nd";
			case "3":
				return dy + "rd";
			default:
				return dy + "th";
		}
	}

	public bookColor(bk: CarerBooking): string {
		var shiftColors = ['lavender', 'lightblue', 'salmon'];
		if (bk === undefined) return '';
		if (this.absenceCodes.some(ac => ac === bk.bookingType)) return 'lightgoldenrodyellow';
		//return shiftColors[bk.shift-1];
		return new Date(bk.thisStart).getHours()<15 ? shiftColors[0] : shiftColors[1];
	}

	public minsForAdjustments(): number {
		return this.adjustments
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public minsAdjustOffset(offset: number) {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == offset)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public adjustHours(offset: number, day: string) {
		this.adjustDate = offset;
		this.adjustDay = day;
		this.adjustShifts = this.timesheet.shifts.filter(sh => sh.day === offset);
		this.adjustVisible = true;
		this.adjustments = new Array<Adjustment>().concat(this.timesheet.adjustments.filter(adj => adj.dayOffset == offset));
		// Temporarily remove the adjustments from the timesheet
		this.timesheet.adjustments = this.timesheet.adjustments.filter(adj => adj.dayOffset !== this.adjustDate);
	}

	public removeAdjust(adjust: Adjustment) {
		this.adjustments = this.adjustments.filter(adj => adj != adjust);
	}

	public closeAdjust() {
		this.timesheet.adjustments = this.timesheet.adjustments.concat(this.adjustments);
		this.adjustVisible = false;
	}

	public addAdjust() {
		this.adjustments.push(new Adjustment(this.timesheet.carerCode, this.timesheet.weekCommencing, this.adjustDate));
	}
}