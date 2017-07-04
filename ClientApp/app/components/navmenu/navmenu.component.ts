import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetProvider } from '../../timesheets/timesheet.provider';
import { LOC_EN } from "../../models/locale";

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.css')]
})
export class NavMenuComponent implements OnInit {

    loc: any = LOC_EN;
    selectedDate: Date;
    showCalendar: boolean = false;

    constructor(public timePro: TimesheetProvider, private router: Router) {
        router.events.subscribe((ev) => {
            this.showCalendar = ev.toString().includes("timesheet-manager");
            if (ev.toString().includes("notfound")) {
                this.router.navigate([{ outlets: [{'summary': [null]}, {'detail': [null]}]}]);
            }
        });
    }

    ngOnInit() {
        this.timePro.selectWeekCommencing(new Date());
    }

    dateSelected(ev: Event) {
        this.timePro.selectWeekCommencing(this.selectedDate);
    }
}
