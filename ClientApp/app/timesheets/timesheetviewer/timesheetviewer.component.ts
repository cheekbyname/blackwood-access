import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

import { DialogModule, Header, Footer, SpinnerModule } from 'primeng/primeng';

import { BookingCardComponent } from '../booking.card/booking.card';
import { Timesheet } from '../../models/timesheet';
import { CarerBooking } from '../../models/booking';
import { Carer } from '../../models/carer';
import { Availability } from '../../models/availability';
import { Shift } from '../../models/shift';
import { Adjustment, AdjustmentOffsetFilter } from '../../models/adjustment';
import { Team } from '../../models/team';

import { TimesheetProvider } from '../timesheet.provider';

type BookingGrid = Array<Array<CarerBooking>>;

@Component({
	selector: 'timesheet-viewer',
	template: require('./timesheetviewer.component.html'),
	styles: [require('./timesheetviewer.component.css')],
	encapsulation: ViewEncapsulation.None
})
export class TimesheetViewerComponent implements OnInit {

	constructor(private http: Http, private timePro: TimesheetProvider ) {

	}

	ngOnInit(): void {
		this.bookings = this.emptyBook();
	}

    private absenceCodes: number [] = [108, 109];
	private unpaidCodes: number [] = [123, 110];
	public days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	public months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	_carer: Carer;
	_weekCommencing: Date;
	timesheet: Timesheet;
	bookings: BookingGrid;
	isContracted: boolean;
	// teams: Team[];

	adjustVisible: boolean = false;
	dayOffset: number;

	bookingVisible: boolean = false;
	selectedBooking: CarerBooking = new CarerBooking();

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
		var ts: Timesheet = res.json() as Timesheet;
		this.timesheet = ts;
		// this.teams = ts.contracts.map((con) => { return { teamCode: con.teamCode, teamDesc: con.teamDesc } as Team });
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
		//bks = this.chronOrder(bks);												// Shift down to make some chronological sense
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
			.filter(bk => !(this.absenceCodes.concat(this.unpaidCodes)).some(uc => uc === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public actualHoursForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day === offset)
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0) + this.minsAdjustOffset(offset);
	}

	public totalActualHoursForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day == offset)
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc +cur }, 0);
	}

	public totalUnpaidHoursForDay(offset: number): number {
		return this.timesheet.shifts
			.filter(sh => sh.day === offset)
			.map(sh => { return sh.unpaidMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public actualHoursForContract(contractCode: number): number {
		return this.timesheet.shifts.filter(sh => sh.contractCode === contractCode)
			.map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0 );
	}

	public additionalHoursForContract(contractCode: number): number {
		var overMins = this.actualHoursForContract(contractCode)
			- this.timesheet.contracts.find(cn => cn.contractCode === contractCode).contractMins;
		return overMins < 0 ? 0 : overMins;
	}

	public leaveSickHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode && (this.absenceCodes).some(ac => ac === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

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

    public monthOf(offset: number): string {
        var dt = new Date(this.weekCommencing);
        dt.setDate(dt.getDate() + offset);
        return this.months[dt.getMonth()];
    }
	public bookColor(bk: CarerBooking): string {
		var shiftColors = ['lavender', 'lightblue', 'salmon'];
		if (bk === undefined) return '';
		if (this.absenceCodes.concat(this.unpaidCodes).some(ac => ac === bk.bookingType)) return 'lightgoldenrodyellow';
		return new Date(bk.thisStart).getHours()<15 ? shiftColors[0] : shiftColors[1];
	}

	public minsForAdjustments(): number {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public minsAdjustOffset(offset: number) {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == offset)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public teamForContract(contractCode: number): string {
		var contract = this.timesheet.contracts.find(con => con.contractCode === contractCode);
		return contract ? contract.teamDesc : "";
	}

	public openAdjustments(offset: number) {
		this.dayOffset = offset;
		this.adjustVisible = true;
	}

	public removeAdjust(adjust: Adjustment) {
		// TODO Move this onto Provider
		// TODO Implement confirmation
		var tsUrl = '/api/timesheet/RemoveTimesheetAdjustment?id=' + adjust.id;
		this.http.delete(tsUrl).subscribe(res => {
			this.timesheet.adjustments.splice(this.timesheet.adjustments.indexOf(adjust), 1);
		});
	}

	public closeAdjust() {
		this.timesheet.adjustments.filter(adj => adj.dayOffset == this.dayOffset).forEach((adj) => {
			// TODO Validation
			this.putAdjustment(adj);
		});
		this.adjustVisible = false;
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

	public prevDay() {
		this.dayOffset--;
	}

	public nextDay() {
		this.dayOffset++;
	}

	public openBookingDetail(bk: CarerBooking) {
		this.selectedBooking = bk;
		this.bookingVisible = true;
	}

	public closeBookingDetail() {
		this.bookingVisible = false;
	}
}
