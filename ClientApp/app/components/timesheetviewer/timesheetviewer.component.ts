import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BookingCardComponent } from '../cards/booking.card/booking.card';
import { Timesheet } from '../../models/timesheet';
import { CarerBooking } from '../../models/booking';
import { Carer } from '../../models/carer';
import { Availability } from '../../models/availability';

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

    private absenceCodes: number [] = [108, 109];

	_carer: Carer;
	_weekCommencing: Date;
	http: Http;
	timesheet: Timesheet;
	bookings = [];
	isContracted: boolean;

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
		var tsUrl = '/api/timesheet/timesheet?carerCode=' + this._carer.carerCode + '&weekCommencing=' + this._weekCommencing;
		this.http.get(tsUrl).subscribe(res => this.handleRes(res));
	}

	handleRes(res): void {
		this.bookings = this.emptyBook();
		var ts: Timesheet = res.json();
		this.timesheet = ts;
		ts.bookings.forEach(bk => this.stuffBook(bk));
		this.transBook();
		this.isContracted = ts.contracts.some(cn => { return cn.contractMins > 0 });
		console.log(this.timesheet);
		document.getElementsByTagName("timesheet-viewer")[0].scrollIntoView();
	}

	emptyBook() {
		return [[],[],[],[],[],[],[]]
	};

	stuffBook(bk: CarerBooking): void {
		// Because we want whole days and valueOf returns milliseconds
		var offset = Math.floor((new Date(bk.thisStart).valueOf() - new Date(this.weekCommencing).valueOf()) / (1000 * 60 * 60 * 24));
		this.bookings[offset].push(bk);
	}

	// Transpose Bookings array
	transBook(): void {
		var bks = this.bookings;
		var len = Math.max(...bks.map(ar => { return ar.length }));					// Get max width of matrix
		if (len-bks.length > 0) bks = bks.concat(Array(len-bks.length).fill([]));	// Pad to square
		bks = bks.map((r, c) => bks.map(r => r[c]));								// Transpose array
		this.bookings = bks.filter((x: [any]) => x.some(e => e !== undefined)); 	// Strip blank rows
	}

	public combinedAvailability(): Availability[] {
		return (this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)).sort(av => { return av.thisStart.valueOf() });
	}

	public displayTime(mins: number): string {
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
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
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public actualHoursForContract(contractCode: number): number {
		// TODO Filter by Contract once we figure out what to do regarding possible multi-contract shifts
		return this.timesheet.shifts
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0 )
	}

	public overtimeHoursForContract(contractCode: number): number {
		return this.timesheet.actualAvailability
			.filter(av => { av.availCode !== 0 && av.contractCode === contractCode})
			.map(av => { return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0);
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
		var shiftColors = ['lavender', 'lightblue', 'hotpink'];
		if (bk === undefined) return '';
		if (this.absenceCodes.some(ac => ac === bk.bookingType)) return 'lightgoldenrodyellow';
		return shiftColors[bk.shift-1];
	}
}