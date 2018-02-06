import { Component } from "@angular/core";

import { Frequency, FrequencyNames } from "../../models/reporting/Enums";
import { ReportingProvider } from "../reporting.provider";
import { Schedule } from "../../models/reporting/Schedule";

@Component({
    selector: 'reporting-schedules',
    templateUrl: 'reporting.schedule.component.html',
    styleUrls: ['reporting.schedule.component.css']
})
export class ReportingScheduleComponent {
    constructor(private repPro: ReportingProvider) {
        this.repPro.userSchedules$.subscribe(scheds => {
            this.mySchedules = scheds;
            console.log(scheds);
        });
    }

    mySchedules: Schedule[] = undefined;
    frequencies = FrequencyNames;
}