import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Carer } from '../../models/Carer';
import { Timesheet } from '../../models/Timesheet';
import { Team } from '../../models/Team';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent {

    private http: Http;

    public teams: Team[];
    public carers: Carer[];
    
    public selectedTeam: Team;
    public selectedCarer: Carer;
    public weekCommencing: Date;
    
    constructor(http: Http) {
        this.http = http;
        
        http.get('/api/timesheet/carers').subscribe(res => {
            this.carers = res.json();
        });

        http.get('api/timesheet/teams').subscribe(res => {
            this.teams = res.json();
        });
    }
}