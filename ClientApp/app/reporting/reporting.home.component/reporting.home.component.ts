import { Component, Pipe, PipeTransform } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";

import { Direction, DirectionNames, Frequency, FrequencyNames, Scope, ScopeNames } from "../../models/reporting/Enums";
import { LocalAuthority } from "../../models/reporting/LocalAuthority";
import { Locale, LOC_EN } from "../../models/Locale";
import { Region } from "../../models/reporting/Region";
import { Report } from "../../models/reporting/Report";
import { ReportingProvider } from "../reporting.provider";
import { Schedule } from "../../models/reporting/Schedule";
import { Service } from "../../models/reporting/Service";
import { Team } from "../../models/payroll/Team";

@Component({
    selector: 'reporting-home',
    templateUrl: 'reporting.home.component.html',
    styleUrls: ['reporting.home.component.css']
})
export class ReportingHomeComponent {

    constructor(private rp: ReportingProvider) {

        rp.reports$.filter(reps => reps !== null).subscribe(reps => this.reports = reps);
        rp.selectedReport$
            .filter(rep => this.reports !== undefined && this.reports !== null)
            .filter(rep => rep !== undefined && rep !== null)
            .subscribe(rep => {
                var selRep = this.reports.find(r => r.id === rep.id);
                this.selectedReport = selRep;
            });
        rp.periodStart$.subscribe(dt => this.selectedStart = dt);
        rp.periodEnd$.subscribe(dt => this.selectedEnd = dt);
        rp.selectedSchedule$.subscribe(sch => this.selectedSchedule = sch);
        rp.selectedScope$.subscribe(sc => this.selectedScope = sc);
        rp.selectedTeam$.subscribe(t => this.selectedTeam = t);
        rp.selectedService$.subscribe(s => this.selectedService = s);
        rp.selectedRegion$.subscribe(r => this.selectedRegion = r);
        rp.selectedLocalAuthority$.subscribe(l => this.selectedLocalAuthority = l);
        rp.reportPdfUrl$.subscribe(pdf => this.pdf = pdf);
        rp.allTeams$.subscribe(t => this.teams = t);
        rp.allServices$.subscribe(s => this.services = s);
        rp.allRegions$.subscribe(r => this.regions = r);
        rp.allLocalAuthorities$.subscribe(l => this.localAuthorities = l);
    }

    loc: Locale = LOC_EN;
    pdf: SafeResourceUrl = null;

    reports: Report[];
    teams: Team[];
    services: Service[];
    regions: Region[];
    localAuthorities: LocalAuthority[];
    directions = DirectionNames;
    frequencies = FrequencyNames;
    scopes = ScopeNames;

    selectedSchedule: Schedule;
    selectedReport: Report;
    selectedScope: Scope;
    selectedStart: Date;
    selectedEnd: Date;
    selectedTeam: Team;
    selectedService: Service;
    selectedRegion: Region;
    selectedLocalAuthority: LocalAuthority;

    selectedDirection: Direction;
    selectedFrequency: Frequency;

    periodStartSelected(ev: any) { this.rp.selectPeriodStart(new Date(ev)) }

    periodEndSelected(ev: any) { this.rp.selectPeriodEnd(new Date(ev)) }

    reportSelected(ev: any) { this.rp.selectReport(ev) }

    scopeSelected(ev: any) { this.rp.selectScope(ev) }

    regionSelected(ev: any) { this.rp.selectRegion(ev) }

    serviceSelected(ev: any) { this.rp.selectService(ev) }

    teamSelected(ev: any) { this.rp.selectTeam(ev) }

    locAuthSelected(ev: any) { this.rp.selectLocAuth(ev) }

    filterSelectionValid() : boolean {
        return this.selectedReport !== null && this.selectedScope !== null && (this.selectedRegion !== null
            || this.selectedService !== null || this.selectedLocalAuthority !== null || this.selectedTeam !== null)
            && this.selectedStart !== null && this.selectedEnd !== null;
    }
}
