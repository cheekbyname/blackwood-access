import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from "rxjs/Rx";

import { DialogModule, Header, Footer, SpinnerModule } from 'primeng/primeng';

import { BookingCardComponent } from '../booking.card/booking.card';
import { BookingDetailComponent } from '../booking.detail/booking.detail.component';
import { TimesheetAdjustmentComponent } from '../timesheet.adjustment/timesheet.adjustment.component';

import { Locale, LOC_EN } from '../../models/Locale';
import { Timesheet } from '../../models/Timesheet';
import { CarerBooking } from '../../models/Booking';
import { Carer } from '../../models/Carer';
import { Availability } from '../../models/Availability';
import { Shift } from '../../models/Shift';
import { Adjustment, AdjustmentOffsetFilter } from '../../models/Adjustment';
import { Team } from '../../models/Team';

import { PayrollProvider } from '../payroll.provider';

type BookingGrid = Array<Array<CarerBooking>>;

@Component({
	selector: 'timesheet-viewer',
	templateUrl: './timesheet.viewer.component.html',
	styleUrls: ['./timesheet.viewer.component.css']
})
export class TimesheetViewerComponent implements OnInit {

	constructor(private http: Http, private payPro: PayrollProvider, private router: Router,
		private route: ActivatedRoute) {

	}

	ngOnInit(): void {
		this.bookings = this.emptyBook();
		this.route.params.subscribe((p) => {
			// if (p['carer'] !== undefined && this.carers !== undefined) {
			// 	var carer = this.carers.find(ca => ca.carerCode == p['carer']);
			// 	this.payPro.selectCarer(carer);
			// }
			if (p['week'] != undefined) {
				this.payPro.selectWeekCommencing(new Date(p['week']));
			}
		});

		Observable
			.combineLatest(this.route.params, this.payPro.carers$, (params, carers) => {
				return { "params": params, "carers": carers }
			})
			.distinctUntilChanged((a, b) => {
				if (a.params['carer'] == null || b.params['carer'] == null) return false;
				return a.params['carer'] == b.params['carer'] && a.carers == b.carers;
			})
			.subscribe(x => {
				if (x.params['carer'] && x.carers) {
					this.payPro.selectCarer(x.carers.find(ca => ca.carerCode == x.params['carer']));
				}
			});

		this.payPro.selectedCarer$.subscribe(ca => {
			this.carer = ca;
			this.navigateTo();
		});

		this.payPro.weekCommencing$.subscribe((wc) => {
			this.weekCommencing = wc;
			this.navigateTo();
		});

		this.payPro.carers$.subscribe(carers => this.carers = carers);
		this.payPro.selectedTeam$.subscribe(tm => this.team = tm);

		this.payPro.timesheet$.subscribe((ts) => {
			if (ts != null) this.processTimesheet(ts);
		});
	}

	public loc: Locale = LOC_EN;

	carer: Carer;
	weekCommencing: Date;
	timesheet: Timesheet;
	bookings: BookingGrid;
	isContracted: boolean;
	carers: Carer[];
	team: Team;		// This required purely for navigation -_-

	adjustVisible: boolean = false;
	dayOffset: number;

	bookingVisible: boolean = false;
	selectedBooking: CarerBooking = new CarerBooking();

	navigateTo() {
		if (this.carer !== undefined && this.carer !== null && this.team !== undefined && this.router.url.includes('timesheet')) {
			this.router.navigate(['/payroll', this.team.teamCode,
				{
					outlets: {
					detail: ['timesheet', {
						carer: this.carer.carerCode,
						week: this.payPro.sqlDate(this.payPro.getWeekCommencingFromDate(this.weekCommencing))
					}],
					summary: ['summary', this.team.teamCode]
				}
			}]);
		}
	}

	// selectCarer(car: Carer) {
	// 	//if (this.carers !== null && car !== null)  this.carer = this.carers.find(carer => carer.carerCode === car.carerCode );
	// 	this.payPro.selectCarer(car);
	// }

	selectWeekCommencing(ev: Event) {
		this.payPro.selectWeekCommencing(this.weekCommencing);
	}

	processTimesheet(ts: Timesheet): void {
		this.bookings = this.emptyBook();
		this.timesheet = ts;
		ts.bookings.forEach(bk => this.stuffBook(bk));
		this.transBook();
		this.isContracted = ts.contracts.some(cn => { return cn.contractMins > 0 });
	}

	emptyBook() {
		return [[],[],[],[],[],[],[]];
	};

	stuffBook(bk: CarerBooking): void {
		// Because we want whole days and valueOf returns milliseconds
        //var offset = Math.floor((new Date(bk.thisStart).valueOf() - new Date(this.weekCommencing).valueOf()) / (1000 * 60 * 60 * 24));
  //      var offset = Math.round((new Date(bk.thisStart).getTime() - new Date(this.weekCommencing).getTime()) / (1000 * 60 * 60 * 24));
		//offset = offset < 0 ? 0 : offset;
        this.bookings[this.offsetFor(this.weekCommencing, bk.thisStart)].push(bk);
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
	// Not currently used because it "looks wrong"
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
			.filter(bk => !(this.payPro.absenceCodes.concat(this.payPro.unpaidCodes)).some(uc => uc === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public actualHoursForDay(offset: number): number {
		let shiftTime = this.timesheet.shifts
			.filter(sh => sh.day === offset)
            .map(sh => { return sh.shiftMins - sh.unpaidMins }).reduce((acc, cur) => { return acc + cur }, 0) + this.minsAdjustOffset(offset);
        return shiftTime;
	}

    public totalActualHoursForDay(offset: number): number {
        let shiftTime = this.timesheet.shifts
			.filter(sh => sh.day == offset)
            .map(sh => { return sh.shiftMins }).reduce((acc, cur) => { return acc + cur }, 0);
        let leaveSickTime = this.timesheet.bookings
            .filter(bk => this.offsetFor(this.weekCommencing, bk.thisStart) == offset && this.payPro.absenceCodes.some(ac => ac == bk.bookingType))
            .map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
        return shiftTime + leaveSickTime;
	}

    public offsetFor(dt1: Date, dt2: Date): number {
        let start = new Date(dt1);
        start.setHours(0);
        let finish = new Date(dt2);
        let offset = Math.floor((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return offset < 0 ? 0 : offset;
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
			.filter(bk => bk.contractCode === contractCode && (this.payPro.absenceCodes).some(ac => ac === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public bookColor(bk: CarerBooking): string {
		var shiftColors = ['lavender', 'lightblue', 'salmon'];
		if (bk === undefined) return '';
        if (bk.bookingCode === 133) return 'palegreen';
		if (this.payPro.absenceCodes.concat(this.payPro.unpaidCodes).some(ac => ac === bk.bookingType)) return 'lightgoldenrodyellow';
		//return new Date(bk.thisStart).getHours()<15 ? shiftColors[0] : shiftColors[1];
		return shiftColors[bk.shift - 1];
	}

	public minsAdjustOffset(offset: number): number {
		return this.timesheet.adjustments.filter(adj => adj.dayOffset == offset && adj.rejected == null)
			.map(adj => { return (adj.mins || 0) + ((adj.hours || 0) * 60) }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public hasAdjustOffset(offset: number): boolean {
		return this.timesheet.adjustments.some(adj => adj.dayOffset == offset) && !this.hasAdjustOffsetAction(offset);
	}

	public hasAdjustOffsetAction(offset: number): boolean {
		return this.timesheet.adjustments.some(adj => adj.dayOffset == offset && adj.authorised == null && adj.rejected == null);
	}

	public hasInvalidShift(offset: number): boolean {
		return this.timesheet.shifts.some(shift => shift.day === offset && shift.validBreak == false);
	}

	public openAdjustments(offset: number) {
		this.dayOffset = offset;
		this.adjustVisible = true;
	}

	public openBookingDetail(bk: CarerBooking) {
		this.selectedBooking = bk;
		this.bookingVisible = true;
	}

	public clearDetail() {
		//this.router.navigate([{ outlets: { 'detail': null }}]);
		this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.team.teamCode] }}]);

	}
}
