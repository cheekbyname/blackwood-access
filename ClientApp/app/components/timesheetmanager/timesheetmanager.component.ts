import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Carer } from '../../models/Carer';
import { Timesheet } from '../../models/Timesheet';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent {

    private http: Http;

    public carers: Carer[];
    public selectedCarer: Carer;
    public weekCommencing: Date;
    public timeSheet: Timesheet;

    constructor(http: Http) {
        this.http = http;
        http.get('/api/timesheet/carers').subscribe(res => {
            this.carers = res.json();
        });
    }

    public showTimesheet(http: Http): void {
        console.log('Retrieving for ' + this.selectedCarer.carerCode + ' & ' + this.weekCommencing);
        this.http.get('/api/timesheet/timesheet?carerCode=' + this.selectedCarer.carerCode + '&weekCommencing=' + this.weekCommencing).subscribe(res => {
            this.timeSheet = res.json();
            console.log(this.timeSheet);
        });
    }
}