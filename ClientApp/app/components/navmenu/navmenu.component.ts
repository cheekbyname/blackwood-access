import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { PayrollProvider } from '../../payroll/payroll.provider';
import { UserProvider } from "../../user.provider";

import { LOC_EN } from "../../models/Locale";
import { AccessUser } from '../../models/AccessUser';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit {

    loc: any = LOC_EN;
    selectedDate: Date;
    showCalendar: boolean = false;
    showAdmin: boolean = false;
    showReports: boolean = false;
    showIntegration: boolean = false;
    user: AccessUser;

    constructor(public pp: PayrollProvider, private router: Router, private up: UserProvider) {
        router.events.subscribe((ev) => {
            this.showCalendar = this.router.url.includes("payroll") && !this.router.url.includes("admin");
            this.showAdmin = this.router.url.includes("admin");
            this.showReports = this.router.url.includes("reports");
            this.showIntegration = this.router.url.includes("integration");

            if (ev.toString().includes("notfound")) {
                this.router.navigate([{ outlets: [{'summary': [null]}, {'detail': [null]}]}]);
            }
        });
        up.userInfo$.subscribe(usr => {
            this.user = usr;
        });
    }

    ngOnInit() {
        this.pp.selectWeekCommencing(new Date());
        this.pp.weekCommencing$.subscribe((wc) => {
            this.selectedDate = wc;
        });
    }

    dateSelected(ev: Event) {
        this.pp.setPeriod(this.selectedDate);
        this.pp.selectWeekCommencing(this.selectedDate);
    }
}
