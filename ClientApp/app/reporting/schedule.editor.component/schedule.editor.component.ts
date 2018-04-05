import { Component, Input } from "@angular/core";

import { Locale, LOC_EN } from "../../models/Locale";
import { Region } from "../../models/reporting/Region";
import { Report } from "../../models/reporting/Report";
import { Schedule } from "../../models/reporting/Schedule";
import { ScopeNames } from "../../models/reporting/Enums";
import { Service } from "../../models/reporting/Service";
import { Team } from "../../models/payroll/Team";

import { ReportingProvider } from "../reporting.provider";

@Component({
    selector: 'schedule-editor',
    templateUrl: 'schedule.editor.component.html'
})
export class ScheduleEditorComponent {

    constructor(private repPro: ReportingProvider) {
        this.repPro.allServices$.subscribe(s => this.services = s);
        this.repPro.allTeams$.subscribe(t => this.teams = t);
        this.repPro.allRegions$.subscribe(r => this.regions = r);
        this.repPro.reports$.subscribe(r => this.reports = r);

        var my = this.sched;
        my.runTime = new Date(my.runTime);
        if (my.reportId !== null && this.reports !== null) my.report = this.reports.find(r => r.id === my.reportId);
        if (my.teamId !== null && this.teams !== null) my.team = this.teams.find(t => t.teamCode === my.teamId);
        if (my.serviceId !== null && this.services !== null) my.service = this.services.find(s => s.id === my.serviceId);
        if (my.regionId !== null && this.regions !== null) my.region = this.regions.find(r => r.id === my.regionId);
    }

    @Input()
    public sched: Schedule;

    regions: Region[];
    reports: Report[];
    services: Service[];
    teams: Team[];
    scopes = ScopeNames;
    loc: Locale = LOC_EN;

}