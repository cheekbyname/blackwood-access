import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BehaviorSubject, Observable, Subscription } from "rxjs/Rx";
import "rxjs/add/operator/toPromise";

import { AccessUser } from "../models/accessuser";
import { Adjustment } from "../models/adjustment";
import { Carer } from "../models/carer";
import { CarerContract } from "../models/contract";
import { Locale, LOC_EN } from "../models/locale";
import { Payroll } from "../models/payroll";
import { Summary } from "../models/summary";
import { Team } from "../models/team";
import { Timesheet } from "../models/timesheet";
import { ValidationResult } from "../models/validation";

import { UserProvider } from "../user.provider";

@Injectable()
export class PayrollProvider {

    private _weekCommencing = new BehaviorSubject<Date>(new Date());
    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodFinish = new BehaviorSubject<Date>(null);
    private _selectedTeam = new BehaviorSubject<Team>(new Team());
    private _selectedCarer = new BehaviorSubject<Carer>(null);
    private _teams = new BehaviorSubject<Team[]>(null);
    private _carers = new BehaviorSubject<Carer[]>(null);
    private _adjustments = new BehaviorSubject<Adjustment[]>(null);
    private _timesheet = new BehaviorSubject<Timesheet>(null);
    private _summaries = new BehaviorSubject<Summary[]>(null);
    private _validation = new BehaviorSubject<ValidationResult>(null);
    private _export = new BehaviorSubject<Payroll[]>(undefined);

    weekCommencing$ = this._weekCommencing.asObservable().distinctUntilChanged();
    periodStart$ = this._periodStart.asObservable().distinctUntilChanged();
    periodFinish$ = this._periodFinish.asObservable().distinctUntilChanged();
    selectedTeam$ = this._selectedTeam.asObservable()
        .distinctUntilChanged((a: Team, b: Team) => a.teamCode === b.teamCode);
    selectedCarer$ = this._selectedCarer.asObservable()
        .distinctUntilChanged((a: Carer, b: Carer) => a !== null && b !== null && a.carerCode === b.carerCode);
    validation$ = this._validation.asObservable();
    export$ = this._export.asObservable();

    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();
    adjustments$ = this._adjustments.asObservable();
    timesheet$ = this._timesheet.asObservable();
    summaries$ = this._summaries.asObservable();

    weekObserver$: Observable<{"weekCommencing": Date, "carer": Carer}>;
    weekSub: Subscription;
    periodObserver$: Observable<{ "team": Team, "start": Date, "finish": Date }>;
    periodSub: Subscription;

    public locale: Locale = LOC_EN;
    public absenceCodes: number [] = [108, 109];
    public unpaidCodes: number [] = [123, 110, 98];

    private user: AccessUser;

    constructor(public http: Http, private userPro: UserProvider) {

        Observable
            .combineLatest(this.periodStart$, this.selectedTeam$, (wc: Date, tm: Team) => {
                return { "periodStart": wc, "selectedTeam": tm };
            })
            .distinctUntilChanged((a, b) => {
                if (a.selectedTeam === null || b.selectedTeam === null || a.periodStart === null || b.periodStart === null)
                    return false;
                return (a.selectedTeam.teamCode === b.selectedTeam.teamCode)
                    && (a.periodStart.toLocaleDateString() === b.periodStart.toLocaleDateString());
            })
            .subscribe(x => {
                if (x.selectedTeam.teamCode && x.periodStart) {
                    // TODO Consider suspending this.weekSub until carers refreshed
                    this.getCarers(x.selectedTeam, x.periodStart);
                }
            });

        this.weekObserver$ = Observable
            .combineLatest(this.weekCommencing$, this.selectedCarer$, (wc, carer) => {
                return { "weekCommencing": wc, "carer": carer}
            })
            .distinctUntilChanged((a, b) => {
                if (a.carer === null || b.carer === null || a.weekCommencing === null || b.weekCommencing === null)
                    return false;
                return (a.carer.carerCode === b.carer.carerCode)
                    && (a.weekCommencing.toLocaleDateString() === b.weekCommencing.toLocaleDateString());
            });
        this.weekSub = this.weekObserver$
            .subscribe(x => this.handleWeek(x));

        this.periodObserver$ = Observable
            .combineLatest(this.selectedTeam$, this.periodStart$, this.periodFinish$, (team, start, finish) => {
                return { "team": team, "start": start, "finish": finish }
            })
            .distinctUntilChanged((a, b) => {
                if (a.team === null || b.team === null || a.start === null || b.start === null || a.finish === null || b.finish === null)
                    return false;
                return (a.team.teamCode === b.team.teamCode)
                    && (a.start.toLocaleDateString() === b.start.toLocaleDateString())
                    && (a.finish.toLocaleDateString() === b.finish.toLocaleDateString());
            });
        this.periodSub = this.periodObserver$
            .subscribe(x => this.handlePeriod(x));

        this.userPro.userInfo$.subscribe(x => this.user = x);

        this.getTeams();
    }

    handlePeriod(x) {
        if (x.start != null && x.finish != null && x.finish > x.start && x.team.teamCode) {
            this._summaries.next(null);
            this._adjustments.next(null);
            this._validation.next(null);
            this._export.next(undefined);
            
            this.getSummaries(x.team, x.start, x.finish);
            this.getTimesheetAdjustmentsByTeam(x.team, x.start, x.finish);
            this.getValidationResult(x.team, x.start, x.finish);
            this.getPayrollExport(x.team, x.start, x.finish);
        }
    }

    handleWeek(x) {
        if (x.weekCommencing != null && x.carer != null) {
            this._timesheet.next(null);
            this.getTimesheet(x.carer, x.weekCommencing);
        }
    }

    selectWeekCommencing(dt: Date) {
        this._weekCommencing.next(this.getWeekCommencingFromDate(dt));
    }

    selectTeam(team: Team) {
        this._selectedTeam.next(team);
    }

    selectCarer(carer: Carer) {
        this._selectedCarer.next(carer);
    }

    setPeriodStart(dt: Date) {
        this._periodStart.next(dt);
    }

    setPeriodFinish(dt: Date) {
        this._periodFinish.next(dt);
    }

	setPeriod(dt: Date) {
        // Get first and last of month from a selected date
        // TODO Refactor this to take Dundee's pathological timetable into account
		var start = new Date(dt.getFullYear(), dt.getMonth(), 1);
		var finish = new Date(dt.getFullYear(), dt.getMonth()+1, 0);

        this.periodSub.unsubscribe();

		this.setPeriodFinish(finish);
		this.setPeriodStart(start);

        this.periodSub = this.periodObserver$.subscribe(x => this.handlePeriod(x));
	}

    getTeams() {
        var teams: Team[];
        this.http.get('/api/payroll/teams').subscribe(res => {
            var teams = res.json();
            this._teams.next(teams);
        });
    }

    getCarers(tm: Team, wc: Date) {
        var tsUrl = `/api/payroll/carersbyteam?teamCode=${tm.teamCode}&periodStart=${this.sqlDate(wc)}`;
        console.log(tsUrl);
        this.http.get(tsUrl).subscribe(res => {
            var carers = res.json() as Carer[];
            this._selectedCarer.next(null);
            this._carers.next(carers);
        });
    }

	getTimesheet(carer: Carer, weekCommencing: Date): void {
        if (carer != undefined && weekCommencing != undefined) {
            var tsUrl = `/api/payroll/timesheet?carerCode=${carer.carerCode}&weekCommencing=${this.sqlDate(weekCommencing)}`;
            console.log(tsUrl);
            this.http.get(tsUrl).subscribe(res => {
                this._timesheet.next(res.json() as Timesheet);
            });
        }
	}

    getTimesheetAdjustmentsByTeam(team: Team, periodStart: Date, periodEnd: Date) {
        var tsUrl = `/api/payroll/GetTimesheetAdjustmentsByTeam?teamCode=${team.teamCode}&periodStart=${this.sqlDate(periodStart)}&periodEnd=${this.sqlDate(periodEnd)}`;
        console.log(tsUrl);
        this.http.get(tsUrl).subscribe(res => {
            var adjusts = res.json() as Adjustment[];
            this._adjustments.next(adjusts);
        })
    }

	getSummaries(team: Team, periodStart: Date, periodFinish: Date): void {
		if (periodStart != undefined && periodFinish != undefined) {
            var tsUrl = `/api/payroll/summaries/?teamCode=${team.teamCode}&periodStart=${this.sqlDate(periodStart)}&periodEnd=${this.sqlDate(periodFinish)}`;
            console.log(tsUrl);
			this.http.get(tsUrl).subscribe(res => {
                this._summaries.next(res.json() as Summary[]);
			});
		}
	}

    getPayrollExport(team: Team, periodStart: Date, periodFinish: Date) {
		if (periodStart != undefined && periodFinish != undefined) {
            var tsUrl = `/api/payroll/getPayrollData/?teamCode=${team.teamCode}&periodStart=${this.sqlDate(periodStart)}&periodFinish=${this.sqlDate(periodFinish)}`;
            console.log(tsUrl);
			this.http.get(tsUrl).subscribe(res => {
                this._export.next(res.json() as Payroll[]);
			});
		}
    }

    getValidationResult(team: Team, periodStart: Date, periodFinish: Date) {
        var tsUrl = `/api/payroll/validate/?teamCode=${team.teamCode}&periodStart=${this.sqlDate(periodStart)}&periodFinish=${this.sqlDate(periodFinish)}`;
        console.log(tsUrl);
        this.http.get(tsUrl).subscribe(res => {
            this._validation.next(res.json() as ValidationResult);
        });
    }

	public sqlDate(date: Date): string {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + date.getDate();
	}

    // Convenience methods
    public timeFromDate(dt: string): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }

	public displayTime(mins: number): string {
		if (mins < 0) {
			return Math.ceil(mins/60) + "h " + (mins % 60) + "m";
		}
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public displayDate(date: Date): string {
		return new Date(date).toLocaleDateString();
	}

	public teamForContract(contractCode: number, cons: CarerContract[]): string {
		var contract = cons.find(con => con.contractCode === contractCode);
		return contract ? contract.teamDesc : "";
	}

	public dateOrd(wc: Date, offset: number): string {
		var dt = new Date(wc);
		dt.setDate(dt.getDate() + offset);
		var dy = dt.getDate().toString();
		if ((dy.length > 1) && (dy.substr(0, 1) == '1')) return dy + 'th';
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

    public monthOf(wc: Date, offset: number): string {
        var dt = new Date(wc);
        dt.setDate(dt.getDate() + offset);
        return this.locale.monthNames[dt.getMonth()];
    }

    public getWeekCommencingFromDate(dt: Date): Date {
        var dow = dt.getDay() || 7;
        if (dow !== 1) dt.setHours(-24 * (dow - 1));
        return dt;
    }

    public rejectAdjustment(adj: Adjustment): Promise<boolean> {
        adj.authorised = null;
        adj.authorisedBy = null;
        adj.rejected = new Date(Date.now());
        adj.rejectedBy = this.user.accountName;
        return this.updateAdjustment(adj);
    }

    public approveAdjustment(adj: Adjustment): Promise<boolean> {
        adj.authorised = new Date(Date.now());
        adj.authorisedBy = this.user.accountName;
        adj.rejected = null;
        adj.rejectedBy = null;
        return this.updateAdjustment(adj);
    }

    public putAdjustment(adj: Adjustment): Promise<Adjustment> {
        var tsUrl = '/api/payroll/AddTimesheetAdjustment';
        return this.http.put(tsUrl, adj).toPromise().then((res) => {
            return Promise.resolve(res.json() as Adjustment);
        });
    }

    private updateAdjustment(adj: Adjustment): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            this.http.put('api/payroll/UpdateTimesheetAdjustment', adj).subscribe((res) => {
                if (res.status == 200) {
                    return Promise.resolve(true);
                } else {
                    return Promise.reject(false);
                }
            });
        });
    }
}