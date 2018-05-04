import { Component, Pipe, PipeTransform } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { TextDecoder } from "text-encoding";

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
        rp.allLocalAuthorities$.subscribe(l => this.localAuthorities = l);
        rp.allRegions$.subscribe(r => this.regions = r);
        rp.allServices$.subscribe(s => this.services = s);
        rp.allTeams$.subscribe(t => this.teams = t);
        rp.periodEnd$.subscribe(dt => this.selectedEnd = dt);
        rp.periodStart$.subscribe(dt => this.selectedStart = dt);
        rp.reportPdfUrl$
            .catch(err => {
                this.reportException = JSON.parse(new TextDecoder('utf8').decode(new DataView(err._body)));
                this.reportErr = err;
                return Observable.throw(err)
            })
            .subscribe(pdf => this.pdf = pdf);
        rp.selectedLocalAuthority$.subscribe(l => this.selectedLocalAuthority = l);
        rp.selectedRegion$.subscribe(r => this.selectedRegion = r);
        rp.selectedSchedule$.subscribe(sch => this.selectedSchedule = sch);
        rp.selectedScope$.subscribe(sc => this.selectedScope = sc);
        rp.selectedService$.subscribe(s => this.selectedService = s);
        rp.selectedTeam$.subscribe(t => this.selectedTeam = t);

        Observable
            .combineLatest(rp.reports$, rp.allLocalAuthorities$, rp.allRegions$, rp.allServices$, rp.allTeams$, (rp, la, rg, sr, tm) => {
                return { "reports": rp, "localAuthorities": la, "regions": rg, "services": sr, "teams": tm };
            })
            .filter(x => x.reports !== null && x.localAuthorities !== null && x.regions !== null && x.services !== null && x.teams !== null)
            .subscribe(x => this.dataLoaded = true);
    }

    loc: Locale = LOC_EN;
    pdf: SafeResourceUrl = null;
    dataLoaded: boolean = false;
    reportErr: any;
    reportException: any;
    showExceptionDetail: boolean = false;

    reports: Report[];
    teams: Team[];
    services: Service[];
    regions: Region[];
    localAuthorities: LocalAuthority[];
    directions = DirectionNames;
    frequencies = FrequencyNames;
    scopes = ScopeNames.filter(sn => sn.key !== Scope.Unknown);

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

    filterSelectionValid(): boolean {
        return this.selectedReport !== null && this.selectedScope !== null && (this.selectedRegion !== null
            || this.selectedService !== null || this.selectedLocalAuthority !== null || this.selectedTeam !== null)
            && this.selectedStart !== null && this.selectedEnd !== null;
    }

    clearFilters() {
        this.selectedReport = null;
        this.rp.selectReport(null);
        this.rp.selectScope(null);
        this.rp.selectTeam(null);
        this.rp.selectLocalAuthority(null);
        this.rp.selectService(null);
        this.rp.selectRegion(null);
        this.rp.selectPeriodStart(null);
        this.rp.selectPeriodEnd(null);
    }

    toggleExceptionDetail() {
        this.showExceptionDetail = !this.showExceptionDetail;
    }
}
