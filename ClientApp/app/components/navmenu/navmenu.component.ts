import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollProvider } from '../../payroll/payroll.provider';
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

    constructor(public payPro: PayrollProvider, private router: Router) {
        router.events.subscribe((ev) => {
            this.showCalendar = ev.toString().includes("payroll");
            if (ev.toString().includes("notfound")) {
                this.router.navigate([{ outlets: [{'summary': [null]}, {'detail': [null]}]}]);
            }
        });
    }

    ngOnInit() {
        this.payPro.selectWeekCommencing(new Date());
        this.payPro.weekCommencing$.subscribe((wc) => {
            this.selectedDate = wc;
        });
    }

    dateSelected(ev: Event) {
        this.payPro.selectWeekCommencing(this.selectedDate);
        this.payPro.setPeriod(this.selectedDate);
    }
}
