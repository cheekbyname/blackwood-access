import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/subscription';

import { Carer } from '../../models/Carer';
import { Timesheet } from '../../models/Timesheet';
import { Team } from '../../models/Team';
import { TimesheetProvider } from '../timesheet.provider';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [ require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent implements OnInit {

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
        this.teamSub = this.timePro.teams$.subscribe(teams => {
            this.teams = teams;
        });
        this.selectedDateSub = this.timePro.weekCommencing$.subscribe(dt => {
            this.weekCommencing = this.getWeekCommencingFromDate(dt);
        });

        // Init Team list in TimesheetService 
        this.timePro.getTeams();
    }

    @Input()
    get selectedTeam() { return this._selectedTeam }
    set selectedTeam(team: Team ) {
        this._selectedTeam = team;
        console.log(this._selectedTeam);
        this.http.get('/api/timesheet/carersbyteam?teamCode=' + this._selectedTeam.teamCode).subscribe(res => {
            this.carers = res.json();
            console.log(this.carers);
            this.selectedCarer = null;
        });
    }

    constructor(private http: Http, public timePro: TimesheetProvider) {

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
        var mon = "0" + (dt.getMonth() + 1);
        var day = "0" + dt.getDate();
        // TODO Adjust this so it fits yyyy/mm/dd pattern precisely
        return dt.getFullYear() + "-" + mon.substr(mon.length - 2) + "-" + day.substr(day.length - 2);
    }

    showCarer(): boolean {
        return this.weekCommencing && this.selectedTeam && this.carers && this.carers.length > 0
    }
}