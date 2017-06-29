import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetProvider } from '../../timesheets/timesheet.provider';

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.css')]
})
export class NavMenuComponent implements OnInit {

    loc: any;
    selectedDate: Date;
    showCalendar: boolean = false;

    constructor(public timePro: TimesheetProvider, private router: Router) {
        router.events.subscribe((ev) => {
            this.showCalendar = ev.toString().includes("timesheet-manager");
        });
    }

    ngOnInit() {
        this.loc = this.timePro.locale;
    }

    dateSelected(ev: Event) {
        this.timePro.selectWeekCommencing(this.selectedDate);
    }
}
