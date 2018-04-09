import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Observable } from "rxjs/Observable";

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
        repPro.userSchedules$.subscribe(scheds => this.mySchedules = scheds);
        repPro.allSchedules$.subscribe(scheds => this.allSchedules = scheds);
        repPro.reports$.subscribe(r => this.reports = r);

        Observable
            .combineLatest(repPro.allSchedules$, repPro.userSchedules$, (all, user) => {
                return { "all": all, "user": user };
            })
            .filter(x => x.all !== undefined && x.all !== null && x.user !== undefined && x.user !== null)
            .subscribe(x => this.otherSchedules = x.all.filter(a => !x.user.some(u => u.id === a.id)));
    }

    editVisible: boolean = false;
    proc: boolean = false;
    frequencies = FrequencyNames;
    mySchedules: Schedule[] = undefined;
    allSchedules: Schedule[] = undefined;
    otherSchedules: Schedule[] = undefined;
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

    public subscribe(sched: Schedule) {
        this.proc = true;
        this.repPro.subscribeToSchedule(sched).subscribe(res => this.proc = false);
    }
}
