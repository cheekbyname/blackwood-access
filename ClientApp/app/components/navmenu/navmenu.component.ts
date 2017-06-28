import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetProvider } from '../../timesheets/timesheet.provider';

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.css')]
})
export class NavMenuComponent implements OnInit {

    en: any;
    selectedDate: Date;
    showCalendar: boolean = false;

    constructor(public timeSrv: TimesheetProvider, private router: Router) {
        router.events.subscribe((ev) => {
            this.showCalendar = ev.toString().includes("timesheet-manager");
        });
    }

    ngOnInit() {
        this.en = {
            firstDayOfWeek: 1,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
            monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        }
    }

    dateSelected(ev: Event) {
        this.timeSrv.selectWeekCommencing(this.selectedDate);
    }
}
