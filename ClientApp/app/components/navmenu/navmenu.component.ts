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
    user: AccessUser;

    constructor(public payPro: PayrollProvider, private router: Router, private userPro: UserProvider) {
        router.events.subscribe((ev) => {
            this.showCalendar = this.router.url.includes("payroll") && !this.router.url.includes("admin");
            if (ev.toString().includes("notfound")) {
                this.router.navigate([{ outlets: [{'summary': [null]}, {'detail': [null]}]}]);
            }
        });
        userPro.userInfo$.subscribe(usr => {
            this.user = usr;
        });
    }

    ngOnInit() {
        this.payPro.selectWeekCommencing(new Date());
        this.payPro.weekCommencing$.subscribe((wc) => {
            this.selectedDate = wc;
        });
    }

    dateSelected(ev: Event) {
        this.payPro.setPeriod(this.selectedDate);
        this.payPro.selectWeekCommencing(this.selectedDate);
    }
}
