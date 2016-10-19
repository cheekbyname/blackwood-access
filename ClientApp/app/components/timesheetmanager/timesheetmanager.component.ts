import { Component, Input } from '@angular/core';
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

    // May not need these
    private trainingCodes: number [] = [105, 106, 107];
    private absenceCodes: number [] = [108, 109];

    public teams: Team[];
    public carers: Carer[];
    
    _selectedTeam: Team;

    public selectedCarer: Carer;
    public weekCommencing: Date;
    public showManager: Boolean = true;

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

    constructor(http: Http) {
        this.http = http;
        
        // Now redundant - candidate for removal
        http.get('/api/timesheet/carers').subscribe(res => {
            this.carers = res.json();
        });

        http.get('api/timesheet/teams').subscribe(res => {
            this.teams = res.json();
        });
    }

    toggleManager(): void {
        this.showManager = !this.showManager;
    }
}