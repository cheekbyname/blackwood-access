import { Component, Pipe, PipeTransform } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";

import { Direction, DirectionNames, Frequency, FrequencyNames, Scope, ScopeNames } from "../../models/reporting/Enums";
import { Locale, LOC_EN } from "../../models/Locale";
import { Report } from "../../models/reporting/Report";
import { ReportingProvider } from "../reporting.provider";
import { Team } from "../../models/payroll/Team";
import { Schedule } from "../../models/reporting/Schedule";

@Component({
    selector: 'reporting-home',
    templateUrl: 'reporting.home.component.html',
    styleUrls: ['reporting.home.component.css']
})
export class ReportingHomeComponent {
    constructor(private repPro: ReportingProvider) {

        repPro.reports$.filter(reps => reps !== null).subscribe(reps => this.reports = reps);
        repPro.selectedReport$
            .filter(rep => this.reports !== undefined && this.reports !== null)
            .filter(rep => rep !== undefined && rep !== null)
            .subscribe(rep => {
                var selRep = this.reports.find(r => r.id === rep.id);
                this.selectedReport = selRep;
            });
        repPro.periodStart$.subscribe(dt => this.selectedStart = dt);
        repPro.periodEnd$.subscribe(dt => this.selectedEnd = dt);
        repPro.selectedSchedule$.subscribe(sch => this.selectedSchedule = sch);
        repPro.selectedScope$.subscribe(sc => this.selectedScope = sc);
        repPro.reportPdfUrl$.subscribe(pdf => this.pdf = pdf);
    }

    loc: Locale = LOC_EN;
    pdf: SafeResourceUrl = null;

    reports: Report[];
    directions = DirectionNames;
    frequencies = FrequencyNames;
    scopes = ScopeNames;

    selectedSchedule: Schedule;
    selectedReport: Report;
    selectedScope: Scope;
    selectedStart: Date;
    selectedEnd: Date;
    selectedTeam: Team;

    selectedDirection: Direction;
    selectedFrequency: Frequency;

    periodStartSelected(ev: any) {
        this.repPro.selectPeriodStart(new Date(ev));
    }

    periodEndSelected(ev: any) {
        this.repPro.selectPeriodEnd(new Date(ev));
    }

    reportSelected(ev: any) {
        this.repPro.selectReport(ev);
    }

    scopeSelected(ev: any) {
        this.repPro.selectScope(ev);
    }
}
