import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Carer } from '../models/carer';
import { Team } from '../models/team';

@Injectable()
export class TimesheetProvider
{
    private _weekCommencing = new BehaviorSubject<Date>(new Date());
    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodFinish = new BehaviorSubject<Date>(null);
    private _selectedTeam = new BehaviorSubject<Team>(new Team());
    private _selectedCarer = new BehaviorSubject<Carer>(null);
    private _teams = new BehaviorSubject<Team[]>(null);
    private _carers = new BehaviorSubject<Carer[]>(null);

    weekCommencing$ = this._weekCommencing.asObservable();
    periodStart$ = this._periodStart.asObservable();
    periodFinish$ = this._periodFinish.asObservable();
    selectedTeam$ = this._selectedTeam.asObservable();
    selectedCarer$ = this._selectedCarer.asObservable();
    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();

    constructor(public http: Http) {
        this.selectedTeam$.subscribe((tm) => {
            this.getCarers(tm);
        });
        // this.selectWeekCommencing(this.getWeekCommencingFromDate(new Date(Date.now())));
    }

    selectWeekCommencing(dt: Date) {
        this._weekCommencing.next(dt);
    }

    selectTeam(team: Team) {
        this._selectedTeam.next(team);
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

    // getSummaries(tm: Team, periodStart: Date, periodFinish: Date) {
    //     this.http.get('api/timesheet/summaries/?teamCode=' + this._selectedTeam.teamCode
	// 		+ '&periodStart=' + this.sqlDate(this._periodStart)
	// 		+ '&periodEnd=' + this.sqlDate(this._periodFinish)).subscribe( res => {
	// 			this.summaries = res.json();
	// 		console.log(this.summaries);
	// 	});
    // }

	public sqlDate(date: Date): string {
		return date.toISOString().slice(0, date.toISOString().indexOf("T"));
	}

    // getWeekCommencingFromDate(dt: Date): Date {
    //     var dow = dt.getDay() || 7;
    //     if (dow !== 1) dt.setHours(-24 * (dow - 1));
    //     var mon = "0" + (dt.getMonth() + 1);
    //     var day = "0" + dt.getDate();
    //     // TODO Adjust this so it fits yyyy/mm/dd pattern precisely
    //     return dt.getFullYear() + "-" + mon.substr(mon.length - 2) + "-" + day.substr(day.length - 2);
    // }

}