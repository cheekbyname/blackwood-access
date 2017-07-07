import { Component, Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { Adjustment } from "../models/adjustment";
import { Carer } from '../models/carer';
import { Team } from '../models/team';
import { Timesheet } from '../models/timesheet';
import { CarerContract } from '../models/contract';
import { Locale, LOC_EN } from '../models/locale';

@Injectable()
export class TimesheetProvider implements OnInit {

    private _weekCommencing = new BehaviorSubject<Date>(new Date());
    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodFinish = new BehaviorSubject<Date>(null);
    private _selectedTeam = new BehaviorSubject<Team>(new Team());
    private _selectedCarer = new BehaviorSubject<Carer>(null);
    private _teams = new BehaviorSubject<Team[]>(null);
    private _carers = new BehaviorSubject<Carer[]>(null);
    private _adjustments = new BehaviorSubject<Adjustment[]>(null);
    private _timesheet = new BehaviorSubject<Timesheet>(null);

    weekCommencing$ = this._weekCommencing.asObservable();
    periodStart$ = this._periodStart.asObservable();
    periodFinish$ = this._periodFinish.asObservable();
    selectedTeam$ = this._selectedTeam.asObservable();
    selectedCarer$ = this._selectedCarer.asObservable();
    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();
    adjustments$ = this._adjustments.asObservable();
    timesheet$ = this._timesheet.asObservable().debounceTime(250);

    public locale: Locale = LOC_EN;
    public absenceCodes: number [] = [108, 109];
	public unpaidCodes: number [] = [123, 110];

    constructor(public http: Http) {
        this.selectedTeam$.subscribe((tm) => {
            if (tm != undefined) this.getCarers(tm);
        });

        // TODO Apply this technique liberally
        Observable.combineLatest(this.selectedTeam$, this.periodStart$, this.periodFinish$,
            (team, start, finish) => { return { "team": team, "start": start, "finish": finish }})
            .subscribe(x => {
                if (x.start != null && x.finish != null) {
                    this._adjustments.next(undefined);
                    this.getTimesheetAdjustmentsByTeam(x.team, x.start, x.finish);
                }
            });

        Observable.combineLatest(this.weekCommencing$, this.selectedCarer$,
            (wc, carer) => { return { "weekCommencing": wc, "carer": carer }})
            .subscribe(x => {
                this.getTimesheet(x.carer, x.weekCommencing);
            });
    }

    ngOnInit() {
        this.getTeams();
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

    getTeams() {
        var teams: Team[];
        this.http.get('api/timesheet/teams').subscribe(res => {
            var teams = res.json();
            this._teams.next(teams);
        });
    }

    getCarers(tm: Team) {
        var tsUrl = `/api/timesheet/carersbyteam?teamCode=${tm.teamCode}`;
        this.http.get(tsUrl).subscribe(res => {
            var carers = res.json() as Carer[];
            console.log(tsUrl);
            console.log(carers);
            this._selectedCarer.next(null);
            this._carers.next(carers);
        });
    }

	getTimesheet(carer: Carer, weekCommencing: Date): void {
        if (carer != undefined && weekCommencing != undefined) {
            var tsUrl = `/api/timesheet/timesheet?carerCode=${carer.carerCode}&weekCommencing=${this.sqlDate(weekCommencing)}`;
            this.http.get(tsUrl).subscribe(res => {
                console.log(tsUrl);
                console.log(res.json() as Timesheet);
                this._timesheet.next(res.json() as Timesheet);
            });
        }
	}

    getTimesheetAdjustmentsByTeam(team: Team, periodStart: Date, periodEnd: Date) {
        var tsUrl = `api/timesheet/GetTimesheetAdjustmentsByTeam?teamCode=${team.teamCode}&periodStart=${this.sqlDate(periodStart)}&periodEnd=${this.sqlDate(periodEnd)}`;
        this.http.get(tsUrl).subscribe(res => {
            console.log(tsUrl);
            var adjusts = res.json() as Adjustment[];
            console.log(adjusts);
            this._adjustments.next(adjusts.map(adj => {
                adj.weekCommencing = new Date(adj.weekCommencing);
                return adj;
            }));
        })
    }

	// getSummaries(): void {
	// 	if (this.periodStart != undefined && this.periodFinish != undefined) {
	// 		this.summaries = undefined;
	// 		this.http.get('api/timesheet/summaries/?teamCode=' + this._team.teamCode
	// 			+ '&periodStart=' + this.sqlDate(this.periodStart)
	// 			+ '&periodEnd=' + this.sqlDate(this.periodFinish)).subscribe( res => {
	// 				this.summaries = res.json();
	// 			console.log(this.summaries);
	// 		});
	// 	}
	// }

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
            this.http.put('api/timesheet/UpdateTimesheetAdjustment', adj).subscribe((res) => {
                if (res.status == 200) {
                    return Promise.resolve(true);
                } else {
                    return Promise.reject(false);
                }
            });
        });
    }
}