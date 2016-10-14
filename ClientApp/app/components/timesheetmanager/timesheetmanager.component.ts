import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Carer } from '../../models/Carer';

@Component({
    selector: 'timesheet-manager',
    template: require('./timesheetmanager.component.html'),
    styles: [require('./timesheetmanager.component.css')]
})
export class TimesheetManagerComponent {

    public carers: Carer[];
    public selectedCarer: Carer;
    public weekCommencing: Date;

    constructor(http: Http) {
        http.get('/api/timesheet/carers').subscribe(res => {
            this.carers = res.json();
        });
    }

    public showTimesheet(): void {
        alert(this.selectedCarer.forename + " " + this.selectedCarer.surname + " w/c " + this.weekCommencing);
    }
}