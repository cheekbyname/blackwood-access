import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ReportingProvider } from "../../reporting/reporting.provider";
import { Schedule } from "../../models/reporting/Schedule";
import { FREQUENCIES } from "../../models/reporting/Enums";

@Component({
	selector: 'reporting-admin',
    templateUrl: 'reporting.admin.component.html',
    styleUrls: ['reporting.admin.component.css']
})
export class ReportingAdminComponent
{
    constructor(public rp: ReportingProvider, public router: Router) {
        rp.allSchedules$.subscribe(sc => this.schedules = sc);
    }

    schedules: Schedule[];
    frequencies = FREQUENCIES;

    openSchedule(sched: Schedule) {
        this.rp.selectSchedule(sched);
        this.router.navigate(['admin/reporting', sched.id]);
    }
}