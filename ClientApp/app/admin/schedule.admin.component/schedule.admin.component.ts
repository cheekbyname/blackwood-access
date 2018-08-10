import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SafeResourceUrl } from "@angular/platform-browser";

import { ConfirmationService } from "primeng/primeng";
import { MessageService } from "primeng/components/common/messageservice";

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
import { AccessUser } from "../../models/AccessUser";
import { Subscription } from "../../models/reporting/Subscription";

@Component({
    selector: 'schedule-admin',
    templateUrl: 'schedule.admin.component.html',
    styleUrls: ['schedule.admin.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ScheduleAdminComponent implements OnInit {

    constructor(private rp: ReportingProvider, private fb: FormBuilder, private route: ActivatedRoute,
        public router: Router, private cs: ConfirmationService, private ms: MessageService) {
        rp.selectedSchedule$.subscribe(ss => this.sched = ss);
        rp.allServices$.subscribe(s => this.services = s);
        rp.allTeams$.subscribe(t => this.teams = t);
        rp.allRegions$.subscribe(r => this.regions = r);
        rp.reports$.subscribe(r => this.reports = r);
        rp.allLocalAuthorities$.subscribe(l => this.localAuthorities = l);
        rp.reportPdfUrl$.subscribe(pdf => this.pdf = pdf);

        Observable.combineLatest(rp.selectedSchedule$, rp.allRegions$, rp.allServices$, rp.allLocalAuthorities$, rp.allTeams$,
            rp.reports$, (sched, regions, services, locAuths, teams, reports) => {
                return {
                    "sched": sched, "regions": regions, "services": services, "locAuths": locAuths, "teams": teams,
                    "reports": reports
                }
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
                this.dataLoaded = true;
            });
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["schedule"] !== undefined) {
                if (p["schedule"] == 0) {
                    this.rp.selectSchedule(new Schedule());
                } else {
                    this.rp.selectScheduleById(p["schedule"]);
                }
            }
        });
    }

    public sched: Schedule;

    public form: FormGroup = this.fb.group({});
    public saved: any;
    public proc: boolean = false;
    public pdf: SafeResourceUrl = null;
    public chooserVisible: boolean = false;
    public dataLoaded: boolean = false;

    public loc: Locale = LOC_EN;
    public frequencies = FREQUENCIES;
    public periods = FREQUENCIES;
    public scopes = SCOPES;
    public directions = DIRECTIONS;

    public regions: Region[];
    public reports: Report[];
    public services: Service[];
    public teams: Team[];
    public localAuthorities: LocalAuthority[];

    public saveSchedule() {
        this.proc = true;
        this.rp.putSchedule(this.sched)
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            })
            .subscribe((sched) => {
                this.ms.add({
                    severity: 'success', summary: 'Schedule Saved', detail: 'Changes to this Schedule successfully saved'
                });
                this.rp.getAllSchedules();
                this.rp.selectSchedule(sched);
                this.router.navigate(['admin/reporting'], sched.id);
                this.proc = false;
            });
    }

    public resetForm() {
        this.form.reset();
    }

    public reportSelected() { }

    public scopeSelected() { }

    public directionSelected() { }

    public teamSelected(tm: Team) {
        if (tm != undefined) {
            this.clearSelectedScopes();
            this.sched.team = tm;
            this.sched.teamId = tm.id;
        }
    }

    public serviceSelected(sr: Service) {
        if (sr != undefined) {
            this.clearSelectedScopes();
            this.sched.service = sr;
            this.sched.serviceId = sr.id;
        }
    }

    public localAuthoritySelected(la: LocalAuthority) {
        if (la != undefined) {
            this.clearSelectedScopes();
            this.sched.localAuthority = la;
            this.sched.locAuthRef = la.ref;
        }
    }

    public regionSelected(rg: Region) {
        if (rg != undefined) {
            this.clearSelectedScopes();
            this.sched.region = rg;
            this.sched.regionId = rg.id;
        }
    }

    public freqSelected() { }

    public periodSelected() { }

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

    public addSubscriber() {
        this.chooserVisible = true;
    }

    public chooserOnClose(user: AccessUser) {
        this.chooserVisible = false;
        if (user != undefined) {
            var newSub = new Subscription(this.sched, user);
            this.sched.subscriptions.push(newSub);
            this.rp.subscribeUserToSchedule(this.sched, user).subscribe(sub => {
                this.ms.add({
                    severity: 'success', summary: 'Subscription Success',
                    detail: `Subscription to this Schedule for ${user.accountName} was successful`
                });
            });
        }
    }

    public removeSubscriber(sub: Subscription) {
        this.cs.confirm({
            header: "Confirm Unsubscribe",
            message: `Are you sure you want to remove the subscription for ${sub.accessUser.accountName}?`,
            accept: () => {
                var idx = this.sched.subscriptions.findIndex(s => s.id == sub.id);
                this.sched.subscriptions.splice(idx);
                this.rp.unsubscribeUserFromSchedule(sub.scheduleId, sub.accessUserId).subscribe(s => {
                    this.ms.add({
                        severity: 'success', summary: 'Unsubscribe Success',
                        detail: `Unsubscribe from this Schedule for ${sub.accessUser.accountName} was successful`
                    });
                });
            }
        });
    }
}