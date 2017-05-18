import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/subject';
import { Carer } from '../models/carer';
import { Team } from '../models/team';

@Injectable()
export class TimesheetProvider
{
    constructor(public http: Http) {
    }

    private weekCommencingSource = new Subject<Date>();
    private selectedTeamSource = new Subject<Team>();
    private selectedCarerSource = new Subject<Carer>();
    private teamSource = new Subject<Team[]>();
    private carerSource = new Subject<Carer[]>();

    weekCommencing$ = this.weekCommencingSource.asObservable();
    selectedTeam$ = this.selectedTeamSource.asObservable();
    selectedCarer$ = this.selectedCarerSource.asObservable();
    teams$ = this.teamSource.asObservable();
    carers$ = this.carerSource.asObservable();

    selectWeekCommencing(dt: Date) {
        this.weekCommencingSource.next(dt);
    }

    getTeams() {
        var teams: Team[]
        this.http.get('api/timesheet/teams').subscribe(res => {
            teams = res.json();
            this.teamSource.next(teams);
        });
    }
}