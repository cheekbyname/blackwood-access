import { Component, Input, OnInit } from '@angular/core';
// import { CalendarModule } from 'primeng/primeng';
import { Http } from '@angular/http';
import { Carer } from '../../models/Carer';
import { Timesheet } from '../../models/Timesheet';
import { Team } from '../../models/Team';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent implements OnInit {

    private http: Http;

    // May not need these
    private trainingCodes: number [] = [105, 106, 107];

    public teams: Team[];
    public carers: Carer[];
    
    _selectedTeam: Team;

    public selectedCarer: Carer;
    public weekCommencing: any;         // Would love to use Date but js date handling is such bullshit
    public showManager: Boolean = true;

    ngOnInit() {
        var mon = new Date(Date.now());
        var dow = mon.getDay() || 7;
        if (dow !== 1) mon.setHours(-24 * (dow - 1));
        this.weekCommencing = mon.getFullYear() + "-" + (mon.getMonth() + 1) + "-" + mon.getDate();
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

    onSelectedCarer(carerCode: number): void {
        this.selectedCarer = this.carers.find(c => c.carerCode === carerCode);
    }
}