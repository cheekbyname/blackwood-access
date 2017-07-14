import { Component, Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';

import { Adjustment } from "../models/adjustment";
import { Carer } from '../models/carer';
import { CarerContract } from '../models/contract';
import { Locale, LOC_EN } from '../models/locale';
import { Summary } from "../models/summary";
import { Team } from '../models/team';
import { Timesheet } from '../models/timesheet';

@Injectable()
export class PayrollProvider implements OnInit {

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

    weekCommencing$ = this._weekCommencing.asObservable().distinctUntilChanged();
    periodStart$ = this._periodStart.asObservable().distinctUntilChanged();
    periodFinish$ = this._periodFinish.asObservable().distinctUntilChanged();
    selectedTeam$ = this._selectedTeam.asObservable().distinctUntilChanged();
    selectedCarer$ = this._selectedCarer.asObservable().distinctUntilChanged();

    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();
    adjustments$ = this._adjustments.asObservable();
    timesheet$ = this._timesheet.asObservable();
    summaries$ = this._summaries.asObservable();

    paramObserver$: Observable<{ "team": Team, "start": Date, "finish": Date }>;
    paramSub: Subscription;

    public locale: Locale = LOC_EN;
    public absenceCodes: number [] = [108, 109];
	public unpaidCodes: number [] = [123, 110, 98];

    constructor(public http: Http) {
        // this.selectedTeam$.subscribe((tm) => {
        //     if (tm != undefined) this.getCarers(tm);
        // });

        Observable.combineLatest(this.weekCommencing$, this.selectedTeam$,
            (wc, tm) => { return { "weekCommencing": wc, "selectedTeam": tm}})
            .subscribe(x => {
                if (x.selectedTeam.teamCode && x.weekCommencing) {
                    this.getCarers(x.selectedTeam, x.weekCommencing);
                }
            });

        Observable.combineLatest(this.weekCommencing$, this.selectedCarer$,
            (wc, carer) => { return { "weekCommencing": wc, "carer": carer }})
            .subscribe(x => {
                this._timesheet.next(null);
                this.getTimesheet(x.carer, x.weekCommencing);
            });
        
        this.paramObserver$ = Observable.combineLatest(this.selectedTeam$, this.periodStart$, this.periodFinish$,
            (team, start, finish) => { return { "team": team, "start": start, "finish": finish }});
        
        this.paramSub = this.paramObserver$.subscribe(x => this.handleParams(x));

        this.getTeams();
    }

    ngOnInit() {
        
    }

    handleParams(x) {
        if (x.start != null && x.finish != null && x.finish > x.start && x.team.teamCode) {
            this._summaries.next(null);
            this._adjustments.next(undefined);
            // TODO Async plx
            this.getSummaries(x.team, x.start, x.finish);
            this.getTimesheetAdjustmentsByTeam(x.team, x.start, x.finish);
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
		var start = new Date(dt.getFullYear(), dt.getMonth(), 1);
		var finish = new Date(dt.getFullYear(), dt.getMonth()+1, 0);

        this.paramSub.unsubscribe();

		this.setPeriodFinish(finish);
		this.setPeriodStart(start);

        this.paramSub = this.paramObserver$.subscribe(x => this.handleParams(x));
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
			this.http.get(tsUrl).subscribe( res => {
                this._summaries.next(res.json() as Summary[]);
			});
		}
	}

	public sqlDate(date: Date): string {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
        adj.rejectedBy = 'AlexC';               // TODO
        return this.updateAdjustment(adj);
    }

    public approveAdjustment(adj: Adjustment): Promise<boolean> {
        adj.authorised = new Date(Date.now());
        adj.authorisedBy = 'AlexC';             // TODO
        adj.rejected = null;
        adj.rejectedBy = null;
        return this.updateAdjustment(adj);
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