import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SafeResourceUrl } from "@angular/platform-browser";

import { Observable } from "rxjs/Observable";

import { LocalAuthority } from "../../models/reporting/LocalAuthority";
import { Locale, LOC_EN } from "../../models/Locale";
import { Region } from "../../models/reporting/Region";
import { Report } from "../../models/reporting/Report";
import { Schedule } from "../../models/reporting/Schedule";
import { SCOPES, FREQUENCIES, DIRECTIONS } from "../../models/reporting/Enums";
import { Service } from "../../models/reporting/Service";
import { Team } from "../../models/payroll/Team";

import { ReportingProvider } from "../../reporting/reporting.provider";

@Component({
    selector: 'schedule-admin',
    templateUrl: 'schedule.admin.component.html',
    styleUrls: ['schedule.admin.component.css']
})
export class ScheduleAdminComponent implements OnInit {

    constructor(private rp: ReportingProvider, private fb: FormBuilder, private route: ActivatedRoute) {
        rp.selectedSchedule$.subscribe(ss => this.sched = ss);
        rp.allServices$.subscribe(s => this.services = s);
        rp.allTeams$.subscribe(t => this.teams = t);
        rp.allRegions$.subscribe(r => this.regions = r);
        rp.reports$.subscribe(r => this.reports = r);
        rp.allLocalAuthorities$.subscribe(l => this.localAuthorities = l);
        rp.reportPdfUrl$.subscribe(pdf => this.pdf = pdf);

        Observable.combineLatest(rp.selectedSchedule$, rp.allRegions$, rp.allServices$, rp.allLocalAuthorities$, rp.allTeams$,
            rp.reports$, (sched, regions, services, locAuths, teams, reports) => {
                return { "sched": sched, "regions": regions, "services": services, "locAuths": locAuths, "teams": teams,
                    "reports": reports}
            })
            .filter(x => x.sched !== null && x.regions !== null && x.services !== null && x.locAuths !== null && x.teams !== null
                && x.reports !== null)
            .subscribe(x => {
                this.regions = x.regions;
                this.services = x.services;
                this.localAuthorities = x.locAuths;
                this.teams = x.teams;
                this.reports = x.reports;

                x.sched.runTime = new Date(x.sched.runTime);
                if (x.sched.reportId !== null) x.sched.report = this.reports.find(r => r.id === x.sched.reportId);
                if (x.sched.teamId !== null) x.sched.team = this.teams.find(t => t.teamCode === x.sched.teamId);
                if (x.sched.serviceId !== null) x.sched.service = this.services.find(s => s.id === x.sched.serviceId);
                if (x.sched.regionId !== null) x.sched.region = this.regions.find(r => r.id === x.sched.regionId);
                if (x.sched.localAuthority !== null) x.sched.localAuthority = this.localAuthorities
                    .find(l => l.ref == x.sched.locAuthRef);
                this.sched = x.sched;

                this.form = this.fb.group({
                    selectedReport: [this.sched.report, Validators.required],
                    selectedScope: [this.sched.scope, Validators.required],
                    selectedTeam: [this.sched.team],
                    selectedLocalAuthority: [this.sched.localAuthority],
                    selectedService: [this.sched.service],
                    selectedRegion: [this.sched.region],
                    selectedFreq: [this.sched.frequency, Validators.required],
                    selectedPeriod: [this.sched.period, Validators.required],
                    selectedDirection: [this.sched.direction, Validators.required],
                    selectedRunTime: [this.sched.runTime, Validators.required]
                });
                this.saved = this.form.value;
            });
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["schedule"] !== undefined) {
                this.rp.selectScheduleById(p["schedule"]);
            }
        });
    }

    public sched: Schedule;

    form: FormGroup = this.fb.group({});
    saved: any;
    proc: boolean = false;
    pdf: SafeResourceUrl = null;

    loc: Locale = LOC_EN;
    frequencies = FREQUENCIES;
    periods = FREQUENCIES;
    scopes = SCOPES;
    directions = DIRECTIONS;

    regions: Region[];
    reports: Report[];
    services: Service[];
    teams: Team[];
    localAuthorities: LocalAuthority[];

    public dataLoaded(): boolean {
        return this.reports !== null && this.teams !== null && this.localAuthorities !== null && this.services !== null
            && this.regions !== null;
    }

    public saveSchedule() {
        this.proc = true;
        this.rp.putSchedule(this.sched)
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            })
            .subscribe(() => {
                    this.proc = false;
                });
    }

    public resetForm() {
        this.form.reset();
    }

    public reportSelected() { }

    public scopeSelected() { }

    public directionSelected() { }

    public teamSelected(ev: Team) {
        this.clearSelectedScopes();
        this.sched.team = ev;
        this.sched.teamId = ev.id;
    }

    public serviceSelected(ev: Service) {
        this.clearSelectedScopes();
        this.sched.service = ev;
        this.sched.serviceId = ev.id;
    }

    public localAuthoritySelected(ev) {
        this.clearSelectedScopes();
        this.sched.localAuthority = ev;
        this.sched.locAuthRef = ev.ref;
    }

    public regionSelected(ev: Region) {
        this.clearSelectedScopes();
        this.sched.region = ev;
        this.sched.regionId = ev.id;
    }

    public freqSelected() {  }

    public periodSelected() { console.log(this.sched.period) }

    private clearSelectedScopes() {
        this.sched.team = null;
        this.sched.teamId = null;
        this.sched.localAuthority = null;
        this.sched.locAuthRef = null;
        this.sched.service = null;
        this.sched.serviceId = null;
        this.sched.region = null;
        this.sched.regionId = null;
    }
}