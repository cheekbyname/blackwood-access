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
		for (var i=0; i<7; i++){
			this.bookings[i] = [];
		}
	}

	_carer: Carer;
	_weekCommencing: Date;
	http: Http;
	timesheet: Timesheet;
	bookings = [];

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
			// TODO Ensure bookings array is cleared down as elements are being pushed
            this.timesheet = res.json();
			var bookings = res.json().bookings;
			bookings.forEach(bk => this.stuffBook(bk));
			this.transBook();
            console.log(this.timesheet);
			console.log(this.bookings);
        });
	}

	stuffBook(bk: CarerBooking): void {
		// Because we want whole days and valueOf returns milliseconds
		var offset = Math.floor((new Date(bk.thisStart).valueOf() - new Date(this.weekCommencing).valueOf()) / (1000 * 60 * 60 * 24));
		this.bookings[offset].push(bk);
	}

	transBook(): void {
		this.bookings = this.bookings[0].map((x, i) => this.bookings.map(x=>x[i]));
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

	public availHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability).filter(av => av.contractCode === contractCode)
			.map(av => {return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0));
	}

	public bookedHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.bookings.filter(bk => bk.contractCode === contractCode)
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0));
	}

	public overtimeHoursForContract(contractCode: number): string {
		return this.displayTime(this.timesheet.actualAvailability.filter(av => { av.availCode !== 0 && av.contractCode === contractCode})
			.map(av => { return av.thisMins}).reduce((acc, cur) => { return acc + cur}, 0));
	}

	public bookingSlot(offset: number): CarerBooking[] {
		var bookSlot = CarerBooking[7];
		for (var i=0; i<7; i++) {

		}
		return bookSlot;
	}
}