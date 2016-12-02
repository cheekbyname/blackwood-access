import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/subscription';

import { Carer } from '../../models/Carer';
import { Timesheet } from '../../models/Timesheet';
import { Team } from '../../models/Team';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [ require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent implements OnInit {

    // May not need these
    private trainingCodes: number [] = [105, 106, 107];

    public teams: Team[];
    public carers: Carer[];
    
    _selectedTeam: Team;

    teamSub: Subscription;
    selectedDateSub: Subscription;

    public selectedCarer: Carer;
    public weekCommencing: any;         // Would love to use Date but js date handling is such bullshit
    public showManager: Boolean = true;

    ngOnInit() {
        this.weekCommencing = this.getWeekCommencingFromDate(new Date(Date.now()));

        // Subscribe to TimesheetService observables
        this.teamSub = this.timeSrv.teams$.subscribe(teams => {
            this.teams = teams;
        });
        this.selectedDateSub = this.timeSrv.weekCommencing$.subscribe(dt => {
            this.weekCommencing = this.getWeekCommencingFromDate(dt);
        });

        // Init Team list in TimesheetService 
        this.timeSrv.getTeams();
    }

    @Input()
    get selectedTeam() { return this._selectedTeam }
    set selectedTeam(team: Team ) {
        this._selectedTeam = team;
        console.log(this._selectedTeam);
        this.http.get('/api/timesheet/carersbyteam?teamCode=' + this._selectedTeam.teamCode).subscribe(res => {
            this.carers = res.json();
            this.selectedCarer = null;
        })
    }

    constructor(private http: Http, public timeSrv: TimesheetService) {
        // this.http = http;
        // http.get('api/timesheet/teams').subscribe(res => {
        //     this.teams = res.json();
        // });

    }

    toggleManager(): void {
        this.showManager = !this.showManager;
    }

    onSelectedCarer(carerCode: number): void {
        this.selectedCarer = this.carers.find(c => c.carerCode === carerCode);
    }

    getWeekCommencingFromDate(dt: Date): string {
        var dow = dt.getDay() || 7;
        if (dow !== 1) dt.setHours(-24 * (dow - 1));
        return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    }
}