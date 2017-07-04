import { Component, Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

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
    private _timesheet = new BehaviorSubject<Timesheet>(null);

    weekCommencing$ = this._weekCommencing.asObservable();
    periodStart$ = this._periodStart.asObservable();
    periodFinish$ = this._periodFinish.asObservable();
    selectedTeam$ = this._selectedTeam.asObservable();
    selectedCarer$ = this._selectedCarer.asObservable();
    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();
    timesheet$ = this._timesheet.asObservable();

    public locale: Locale = LOC_EN;
    public absenceCodes: number [] = [108, 109];
	public unpaidCodes: number [] = [123, 110];

    constructor(public http: Http) {
        this.selectedTeam$.subscribe((tm) => {
            if (tm != undefined) this.getCarers(tm);
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
        this.http.get('/api/timesheet/carersbyteam?teamCode=' + tm.teamCode).subscribe(res => {
            var carers = res.json();
            this._selectedCarer.next(null);
            this._carers.next(carers);
        });
    }

	getTimesheet(carer: Carer, weekCommencing: Date): void {
        if (carer != undefined && weekCommencing != undefined) {
            var tsUrl = '/api/timesheet/timesheet?carerCode=' + carer.carerCode
                + '&weekCommencing=' + this.sqlDate(weekCommencing);
            this.http.get(tsUrl).subscribe(res => {
                this._timesheet.next(res.json() as Timesheet);
            });
        }
	}

    // getSummaries(tm: Team, periodStart: Date, periodFinish: Date) {
    //     this.http.get('api/timesheet/summaries/?teamCode=' + this._selectedTeam.teamCode
	// 		+ '&periodStart=' + this.sqlDate(this._periodStart)
	// 		+ '&periodEnd=' + this.sqlDate(this._periodFinish)).subscribe( res => {
	// 			this.summaries = res.json();
	// 		console.log(this.summaries);
	// 	});
    // }

	public sqlDate(date: Date): string {
		//return date.toISOString().slice(0, date.toISOString().indexOf("T"));
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}

    // getWeekCommencingFromDate(dt: Date): Date {
    //     var dow = dt.getDay() || 7;
    //     if (dow !== 1) dt.setHours(-24 * (dow - 1));
    //     var mon = "0" + (dt.getMonth() + 1);
    //     var day = "0" + dt.getDate();
    //     // TODO Adjust this so it fits yyyy/mm/dd pattern precisely
    //     return dt.getFullYear() + "-" + mon.substr(mon.length - 2) + "-" + day.substr(day.length - 2);
    // }

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
        // var mon = "0" + (dt.getMonth() + 1);
        // var day = "0" + dt.getDate();
        // // TODO Adjust this so it fits yyyy/mm/dd pattern precisely
        // return dt.getFullYear() + "-" + mon.substr(mon.length - 2) + "-" + day.substr(day.length - 2);
    }

}