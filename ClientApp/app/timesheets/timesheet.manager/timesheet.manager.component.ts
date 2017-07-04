import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import { Team } from '../../models/team';
import { TimesheetProvider } from '../timesheet.provider';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheet.manager.component.html'),
    styles: [ require('./timesheet.manager.component.css')]
})
export class TimesheetManagerComponent implements OnInit {

    public teams: Team[];
    
    _selectedTeam: Team;

    ngOnInit() {
        // Init Team list in TimesheetService TODO Check why this is necessary
        this.timePro.getTeams();

        this.timePro.teams$.subscribe(teams => {
            if (teams != null) {
                this.teams = teams;
                this.route.params.subscribe(params => {
                    if (params['teamCode'] != undefined )
                        this.selectedTeam = teams.find(team => team.teamCode == params['teamCode']);
                });
            }
        })
    }

    @Input()
    get selectedTeam() { return this._selectedTeam }
    set selectedTeam(team: Team ) {
        this._selectedTeam = team;
        this.timePro.selectTeam(team);

        // Navigate to aux route for summary
        this.router.navigate([{ outlets: { 'detail': null }}]).then((q) => {
            this.router.navigate(['timesheet-manager', this.selectedTeam.teamCode]).then((p) => {
                this.router.navigate([{outlets: { 'summary': ['summary', this.selectedTeam.teamCode] }}]);
            });
        });
    }

    constructor(public timePro: TimesheetProvider, private router: Router, private route: ActivatedRoute) { }
}