import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Frequency, FrequencyNames } from "../../models/reporting/Enums";
import { Report } from "../../models/reporting/Report";
import { ReportingProvider } from "../reporting.provider";
import { Schedule } from "../../models/reporting/Schedule";
import { Utils } from '../../Utils'

@Component({
    selector: 'reporting-schedules',
    templateUrl: 'reporting.schedule.component.html',
    styleUrls: ['reporting.schedule.component.css']
})
export class ReportingScheduleComponent {
    constructor(private repPro: ReportingProvider, private router: Router) {
        this.repPro.userSchedules$.subscribe(scheds => {
            this.mySchedules = scheds;
        });
        this.repPro.reports$.subscribe(r => this.reports = r);
    }

    editVisible: boolean = false;
    frequencies = FrequencyNames;
    mySchedules: Schedule[] = undefined;
    selectedSched: Schedule;
    reports: Report[];
    Utils = Utils;

    public viewScheduledReport(sched: Schedule) {
        this.repPro.selectSchedule(sched);
        this.router.navigate(['/reports/home',
            { outlets: { detail: null, summary: null }}]);
    }

    public editSched(sched: Schedule) {
        this.selectedSched = sched;
        this.editVisible = true;
    }

    public onClose() {
        this.editVisible = false;
    }

    public addSchedule() {
        var sched = new Schedule();
        this.mySchedules.push(sched);
        this.editSched(sched);
    }
}
