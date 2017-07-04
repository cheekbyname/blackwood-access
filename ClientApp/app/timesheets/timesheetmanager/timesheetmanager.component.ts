import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/subscription';   // TODO Deprecate
// import { Observable } from 'rxjs/Rx';
//import 'rxjs/add/observable/zip';

// import { Carer } from '../../models/Carer';
// import { Timesheet } from '../../models/Timesheet';
import { Team } from '../../models/team';
import { TimesheetProvider } from '../timesheet.provider';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [ require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent implements OnInit {

    public teams: Team[];
    // public carers: Carer[];
    
    _selectedTeam: Team;

    // teamSub: Subscription;
    selectedDateSub: Subscription;

    // public selectedCarer: Carer;
    public weekCommencing: any;         // Would love to use Date but js date handling is such bullshit
    // public showManager: Boolean = true;

    ngOnInit() {
        // TODO Remove, this component no longer cares about the date
        this.weekCommencing = this.getWeekCommencingFromDate(new Date(Date.now()));

        // Init Team list in TimesheetService 
        this.timePro.getTeams();

        // Subscribe to TimesheetService observables
        // this.timePro.teams$.subscribe(teams => {
        //     this.teams = teams;
        // });
        // this.route.params.subscribe((p) => {
        //     if (p['teamCode'] != undefined && this.teams != null) {
        //         this.selectedTeam = this.teams.find((t) => t.teamCode == p['teamCode']);
        //     }
        // });

        this.timePro.teams$.subscribe(teams => {
            if (teams != null) {
                this.teams = teams;
                this.route.params.subscribe(params => {
                    if (params['teamCode'] != undefined )
                        this.selectedTeam = teams.find(team => team.teamCode == params['teamCode']);
                });
            }
        })

        // TODO Remove, this component no longer cares about the date
        this.selectedDateSub = this.timePro.weekCommencing$.subscribe(dt => {
            this.weekCommencing = this.getWeekCommencingFromDate(dt);
        });
    }

    @Input()
    get selectedTeam() { return this._selectedTeam }
    set selectedTeam(team: Team ) {
        this._selectedTeam = team;
        this.timePro.selectTeam(team);
        console.log(this._selectedTeam);
        // this.http.get('/api/timesheet/carersbyteam?teamCode=' + this._selectedTeam.teamCode).subscribe(res => {
        //     this.carers = res.json();
        //     console.log(this.carers);
        //     this.selectedCarer = null;
        // });
        // Navigate to aux route for summary
        this.router.navigate([{ outlets: { 'detail': null }}]).then((q) => {
            this.router.navigate(['timesheet-manager', this.selectedTeam.teamCode]).then((p) => {
                this.router.navigate([{outlets: { 'summary': ['summary', this.selectedTeam.teamCode] }}]);
            });
        });
    }

    constructor(public timePro: TimesheetProvider, private router: Router, private route: ActivatedRoute) { }

    // toggleManager(): void {
    //     this.showManager = !this.showManager;
    // }

    // onSelectedCarer(carerCode: number): void {
    //     this.selectedCarer = this.carers.find(c => c.carerCode === carerCode);
    // }

    getWeekCommencingFromDate(dt: Date): string {
        var dow = dt.getDay() || 7;
        if (dow !== 1) dt.setHours(-24 * (dow - 1));
        var mon = "0" + (dt.getMonth() + 1);
        var day = "0" + dt.getDate();
        // TODO Adjust this so it fits yyyy/mm/dd pattern precisely
        return dt.getFullYear() + "-" + mon.substr(mon.length - 2) + "-" + day.substr(day.length - 2);
    }

    // showCarer(): boolean {
    //     return this.weekCommencing && this.selectedTeam && this.carers && this.carers.length > 0
    // }
}