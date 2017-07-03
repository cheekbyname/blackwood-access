import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogModule, Header, Footer, SpinnerModule } from 'primeng/primeng';

import { BookingCardComponent } from '../booking.card/booking.card';
import { BookingDetailComponent } from '../booking.detail/booking.detail.component';
import { TimesheetAdjustmentComponent } from '../timesheet.adjustment/timesheet.adjustment.component';

import { Locale, LOC_EN} from '../../models/locale';
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

	constructor(private http: Http, private timePro: TimesheetProvider, private router: Router,
		private route: ActivatedRoute) {

	}

	ngOnInit(): void {
		this.bookings = this.emptyBook();
		this.route.params.subscribe((p) => {
			if (p['carerCode'] != undefined) {
				this.timePro.carers$.subscribe((carers) => {
					if (carers != null) this.carer = carers.find(carer => carer.carerCode == p['carerCode']);
				});
			}
		});
		this.timePro.weekCommencing$.subscribe((wc) => {
			this.weekCommencing = wc;
		});
		this.timePro.timesheet$.subscribe((ts) => {
			if (ts != null) this.processTimesheet(ts);
		})
	}

	public loc: Locale = LOC_EN;

	_carer: Carer;
	_weekCommencing: Date;
	timesheet: Timesheet;
	bookings: BookingGrid;
	isContracted: boolean;

	adjustVisible: boolean = false;
	dayOffset: number;

	bookingVisible: boolean = false;
	selectedBooking: CarerBooking = new CarerBooking();

	@Input()
	set weekCommencing(weekCommencing: Date) {
		this._weekCommencing = weekCommencing;
		if (this.carer) this.timePro.getTimesheet(this.carer, this.weekCommencing);
	}
	get weekCommencing() { return this._weekCommencing }

	@Input()
	set carer(carer: Carer) {
		this._carer = carer;
		if (this.weekCommencing) this.timePro.getTimesheet(this.carer, this.weekCommencing);
	}
	get carer() { return this._carer }

	// getTimesheet(): void {
	// 	// TODO This should really be on the provider
	// 	var tsUrl = '/api/timesheet/timesheet?carerCode=' + this.carer.carerCode
	// 		+ '&weekCommencing=' + this.timePro.sqlDate(this.weekCommencing);
	// 	this.http.get(tsUrl).subscribe(res => this.processTimesheet(res));
	// }

	processTimesheet(ts: Timesheet): void {
		this.bookings = this.emptyBook();
		// var ts: Timesheet = res.json() as Timesheet;
		this.timesheet = ts;
		console.log(this.timesheet);
		ts.bookings.forEach(bk => this.stuffBook(bk));
		this.transBook();
		this.isContracted = ts.contracts.some(cn => { return cn.contractMins > 0 });
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
	// Not currently used
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

	// Not currently used
	public combinedAvailability(): Availability[] {
		return (this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)).sort(av => { return av.thisStart.valueOf() });
	}

	public availHoursForContract(contractCode: number): number {
		return this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)
			.filter(av => av.contractCode === contractCode)
			.map(av => {return av.thisMins}).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public bookedHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode)
			.filter(bk => !(this.timePro.absenceCodes.concat(this.timePro.unpaidCodes)).some(uc => uc === bk.bookingType))
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
			.filter(bk => bk.contractCode === contractCode && (this.timePro.absenceCodes).some(ac => ac === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public bookColor(bk: CarerBooking): string {
		var shiftColors = ['lavender', 'lightblue', 'salmon'];
		if (bk === undefined) return '';
		if (this.timePro.absenceCodes.concat(this.timePro.unpaidCodes).some(ac => ac === bk.bookingType)) return 'lightgoldenrodyellow';
		return new Date(bk.thisStart).getHours()<15 ? shiftColors[0] : shiftColors[1];
	}

	public minsAdjustOffset(offset: number) {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == offset)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public openAdjustments(offset: number) {
		this.dayOffset = offset;
		this.adjustVisible = true;
	}

	public openBookingDetail(bk: CarerBooking) {
		this.selectedBooking = bk;
		this.bookingVisible = true;
	}
}
