import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from "rxjs";

import { BookingTypeAnalysis, AnalysisCategory } from '../../models/payroll/BookingTypeAnalysis';
import { Carer } from '../../models/payroll/Carer';
import { CarerBooking } from '../../models/payroll/Booking';
import { Locale, LOC_EN } from '../../models/Locale';
import { Team } from '../../models/payroll/Team';
import { Timesheet } from '../../models/payroll/Timesheet';

import { PayrollProvider } from '../payroll.provider';

type BookingGrid = Array<Array<CarerBooking>>;

@Component({
	selector: 'timesheet-viewer',
	templateUrl: './timesheet.viewer.component.html',
	styleUrls: ['./timesheet.viewer.component.css']
})
export class TimesheetViewerComponent implements OnInit {

	public readonly LOC: Locale = LOC_EN;

	analysis: BookingTypeAnalysis[];
	carer: Carer;
	weekCommencing: Date;
	timesheet: Timesheet;
	bookings: BookingGrid = this.emptyBook();
	isContracted: boolean;
	carers: Carer[];
	hideableCodes: number[];
	team: Team;		// This required purely for navigation -_-
	proc: boolean = true;

	adjustVisible: boolean = false;
	dayOffset: number;
	bookingVisible: boolean = false;
	selectedBooking: CarerBooking = new CarerBooking();
	showCodes: boolean = false;

	constructor(public pp: PayrollProvider, private router: Router, private route: ActivatedRoute) {
		this.hideableCodes = pp.hideableCodes;
	}

	ngOnInit(): void {
		this.bookings = this.emptyBook();
		this.route.params.subscribe((p) => {
			if (p['week'] != undefined) {
				this.pp.selectWeekCommencing(new Date(p['week']));
			}
		});

		Observable
			.combineLatest(this.route.params, this.pp.carers$, this.pp.analysis$, (params, carers, anals) => {
				return { params: params, carers: carers, anals: anals }
			})
			.filter(p => p.params['carer'] !== null && p.carers !== null &&  p.anals !== null)
			.distinctUntilChanged((a, b) => {
				return a.params['carer'] == b.params['carer'] && a.carers == b.carers;
			})
			.subscribe(x => {
				this.pp.selectCarer(x.carers.find(ca => ca.carerCode == x.params['carer']));
			});

		this.pp.selectedCarer$.subscribe(ca => {
			this.carer = ca;
			this.navigateTo();
		});

		this.pp.weekCommencing$.subscribe((wc) => {
			this.weekCommencing = wc;
			this.navigateTo();
		});

		this.pp.carers$.subscribe(carers => this.carers = carers);
		this.pp.selectedTeam$.subscribe(tm => this.team = tm);
		this.pp.analysis$.subscribe(a => this.analysis = a);

		this.pp.timesheet$.subscribe((ts) => {
			if (ts != null) this.processTimesheet(ts);
		});
	}

	navigateTo() {
		if (this.carer !== undefined && this.carer !== null && this.team !== undefined && this.router.url.includes('timesheet')) {
			this.router.navigate(['/payroll', this.team.teamCode,
				{
					outlets: {
						detail: ['timesheet', {
							carer: this.carer.carerCode,
							week: this.pp.sqlDate(this.pp.getWeekCommencingFromDate(this.weekCommencing))
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
		this.bookings = this.emptyBook();
		this.pp.selectWeekCommencing(this.weekCommencing);
	}

	processTimesheet(ts: Timesheet): void {
		this.bookings = this.emptyBook();
		this.timesheet = ts;
		ts.bookings.forEach(bk => {
			if (this.showCodes || (!this.showCodes && !this.hideableCodes.some(hc => hc === bk.bookingType)))
				this.stuffBook(bk);
		});
		this.transBook();
		this.isContracted = ts.contracts.some(cn => { return cn.contractMins > 0 });
		this.proc = false;
	}

	private emptyBook(): BookingGrid {
		this.proc = true;
		return [[], [], [], [], [], [], []];
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
		if (len - bks.length > 0) bks = bks.concat(Array(len - bks.length).fill([]));	// Pad to square
		bks = bks.map((x, y) => bks.map(x => x[y]));								// Transpose array
		//bks = this.chronOrder(bks);												// Shift down to make some chronological sense
		this.bookings = bks.filter((x: [any]) => x.some(e => e !== undefined)); 	// Strip blank rows
	}

	public availHoursForContract(contractCode: number): number {
		return this.timesheet.scheduledAvailability.concat(this.timesheet.actualAvailability)
			.filter(av => av.contractCode === contractCode)
			.map(av => { return av.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	// Replace with Contact time?
	public bookedHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode)
			.filter(bk => !(this.pp.absenceCodes.concat(this.pp.unpaidCodes)).some(uc => uc === bk.bookingType))
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
			.map(sh => { return sh.shiftMins - sh.unpaidMins }).reduce((acc, cur) => { return acc + cur }, 0);
		let leaveSickTime = this.timesheet.bookings
			.filter(bk => this.offsetFor(this.weekCommencing, bk.thisStart) == offset && this.pp.absenceCodes.some(ac => ac == bk.bookingType))
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
			.map(sh => { return sh.shiftMins - sh.unpaidMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public additionalHoursForContract(contractCode: number): number {
		var overMins = this.actualHoursForContract(contractCode)
			- this.timesheet.contracts.find(cn => cn.contractCode === contractCode).contractMins;
		return overMins < 0 ? 0 : overMins;
	}

	public leaveSickHoursForContract(contractCode: number): number {
		return this.timesheet.bookings
			.filter(bk => bk.contractCode === contractCode && (this.pp.absenceCodes).some(ac => ac === bk.bookingType))
			.map(bk => { return bk.thisMins }).reduce((acc, cur) => { return acc + cur }, 0);
	}

	public bookColor(bk: CarerBooking): string {
		if (bk === undefined) return '';

		if (this.pp.absenceCodes.some(t => t == bk.bookingType)) return 'paleturquoise';

		var cats = this.analysis.filter(a => a.bookingTypeCode == bk.bookingType).map(a => a.analysisCategory);
		if (cats.some(c => c == AnalysisCategory.TravelTime)) return 'bisque';
		if (cats.some(c => c == AnalysisCategory.NonContactTime)) return 'lightgoldenrodyellow';

		var shiftColors = ['lavender', 'lightblue', 'burlywood'];
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
			{ outlets: { detail: null, summary: ['summary', this.team.teamCode] } }]);
	}

	public showCodesChanged() {
		this.processTimesheet(this.timesheet);
	}

	public weekBack() {
		this.bookings = this.emptyBook();
		this.pp.selectWeekCommencing(this.adjustDate(this.weekCommencing, -7));
	}

	public weekForward() {
		this.bookings = this.emptyBook();
		this.pp.selectWeekCommencing(this.adjustDate(this.weekCommencing, 7));
	}

	public adjustDate(adjDate: Date, offset: number): Date {
		let dt: Date = new Date(adjDate);
		dt.setDate(dt.getDate() + offset);
		return dt;
	}

	public dayTooltip(day, i) {
		return `Click here to adjust hours for ${day} ${this.pp.dateOrd(this.weekCommencing, i)} ${this.pp.monthOf(this.weekCommencing, i)}`;
	}
}
