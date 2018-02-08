import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Frequency, FrequencyNames } from "../../models/reporting/Enums";
import { ReportingProvider } from "../reporting.provider";
import { Schedule } from "../../models/reporting/Schedule";

@Component({
    selector: 'reporting-schedules',
    templateUrl: 'reporting.schedule.component.html',
    styleUrls: ['reporting.schedule.component.css']
})
export class ReportingScheduleComponent {
    constructor(private repPro: ReportingProvider, private router: Router) {
        this.repPro.userSchedules$.subscribe(scheds => {
            this.mySchedules = scheds;
            console.log(scheds);
        });
    }

    mySchedules: Schedule[] = undefined;
    frequencies = FrequencyNames;

    public formatDate = (dt) => new Date(dt).toLocaleDateString("en-GB");

    public viewScheduledReport(sched: Schedule) {
        this.repPro.selectReport(sched.report);
        this.repPro.selectPeriodStart(new Date(sched.runPeriod.item1));
        this.repPro.selectPeriodEnd(new Date(sched.runPeriod.item2));
        this.router.navigate(['/reports/home',
            { outlets: { detail: null, summary: null }}]);

    }
}