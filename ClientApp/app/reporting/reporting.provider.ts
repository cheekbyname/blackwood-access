import { Injectable, isDevMode } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { BehaviorSubject, Observable } from "rxjs/Rx";

import { Region } from "../models/reporting/Region";
import { Report } from "../models/reporting/Report";
import { Schedule } from "../models/reporting/Schedule";
import { Scope, ScopeNames } from "../models/reporting/Enums";
import { Service } from "../models/reporting/Service";
import { Subscription } from "../models/reporting/Subscription";
import { Team } from "../models/payroll/Team";

import { Utils } from "../Utils";
import { LocalAuthority } from "../models/reporting/LocalAuthority";

@Injectable()
export class ReportingProvider {
    constructor(private http: Http, private sanitizer: DomSanitizer) {
        this.getUserSchedules();
        this.getAllReports();
        this.getAllRegions();
        this.getAllServices();
        this.getAllLocalAuthorities();
        this.getAllTeams();
        this.getAllSchedules();

        this.reports$.filter(reps => reps !== null && reps !== undefined).subscribe(reps => this.reports = reps);
    }

    private reports: Report[];

    private _reports = new BehaviorSubject<Report[]>(null);
    private _allSchedules = new BehaviorSubject<Schedule[]>(null);
    private _userSchedules = new BehaviorSubject<Schedule[]>(null);
    private _allRegions = new BehaviorSubject<Region[]>(null);
    private _allTeams = new BehaviorSubject<Team[]>(null);
    private _allServices = new BehaviorSubject<Service[]>(null);
    private _allLocalAuthorities = new BehaviorSubject<LocalAuthority[]>(null);

    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodEnd = new BehaviorSubject<Date>(null);
    private _selectedReport = new BehaviorSubject<Report>(null);
    private _selectedSchedule = new BehaviorSubject<Schedule>(null);

    private _selectedScope = new BehaviorSubject<Scope>(null);
    private _selectedTeam = new BehaviorSubject<Team>(null);
    private _selectedService = new BehaviorSubject<Service>(null);
    private _selectedRegion = new BehaviorSubject<Region>(null);
    private _selectedLocalAuthority = new BehaviorSubject<LocalAuthority>(null);

    private _reportPdfUrl = new BehaviorSubject<SafeResourceUrl>(null);
    
    public reports$ = this._reports.asObservable();
    public allSchedules$ = this._allSchedules.asObservable();
    public allRegions$ = this._allRegions.asObservable();
    public allServices$ = this._allServices.asObservable();
    public allTeams$ = this._allTeams.asObservable();
    public allLocalAuthorities$ = this._allLocalAuthorities.asObservable();
    public userSchedules$ = this._userSchedules.asObservable().filter(s => s !== null);
    public periodStart$ = this._periodStart.asObservable();
    public periodEnd$ = this._periodEnd.asObservable();
    public selectedReport$ = this._selectedReport.asObservable();
    public selectedSchedule$ = this._selectedSchedule.asObservable();
    public selectedScope$ = this._selectedScope.asObservable();
    public selectedTeam$ = this._selectedTeam.asObservable();
    public selectedService$ = this._selectedService.asObservable();
    public selectedRegion$ = this._selectedRegion.asObservable();
    public selectedLocalAuthority$ = this._selectedLocalAuthority.asObservable();

    public reportPdfUrl$ = this._reportPdfUrl.asObservable();

    public reportScope$ = Observable.combineLatest(this.selectedTeam$, this.selectedService$, this.selectedRegion$,
        this.selectedLocalAuthority$, (t, s, r, l) => {
            return { "team": t, "service": s, "region": r, "locAuth": l }
        })
        .filter(x => x.team !== null || x.service !== null || x.region !== null);

    public reportPeriod$ = Observable.combineLatest(this.periodStart$, this.periodEnd$, (s, e) =>{
            return { "start": s, "end": e }
        })
        .filter(x => x.start !== null && x.end !== null);

    public reportOptions$ = Observable.combineLatest(this. selectedReport$, this.reportScope$, this.reportPeriod$, (r, s, p) => {
            return { "report": r, "scope": s, "period": p }
        })
        .filter(x => x.report !== null && x.scope !== null && x.period !== null)
        .distinctUntilChanged((x, y) => { return this.getReportUrl(x) == this.getReportUrl(y) })
        .subscribe(x => this.getReport(x));

    public getAllReports() {
        this.http.get('/api/reporting/allReports').subscribe(res => this._reports.next(res.json() as Report[]));
    }

    public getAllRegions() {
        this.http.get('/api/reporting/regions').subscribe(res => this._allRegions.next(res.json() as Region[]));
    }

    public getAllServices() {
        this.http.get('/api/reporting/services').subscribe(res => this._allServices.next(res.json() as Service[]));
    }

    public getAllLocalAuthorities() {
        this.http.get('/api/reporting/localauthorities').subscribe(res => this._allLocalAuthorities.next(res.json() as LocalAuthority[]));
    }

    public getAllTeams() {
        this.http.get('/api/reporting/teams').subscribe(res => this._allTeams.next(res.json() as Team[]));
    }

    public getAllSchedules() {
        this.http.get('api/reporting/allschedules').subscribe(res => this._allSchedules.next(res.json() as Schedule[]));
    }

    public getUserSchedules() {
        this.http.get('/api/reporting/schedulesForUser').subscribe(res => this._userSchedules.next(res.json() as Schedule[]));
    }

    public selectReport(rep: Report) { this._selectedReport.next(this.reports.find(r => r.id === rep.id)) }

    public selectPeriodStart(dt: Date) { this._periodStart.next(dt) }

    public selectPeriodEnd(dt: Date) { this._periodEnd.next(dt) }

    public selectScope(sc: Scope) { this._selectedScope.next(sc) }

    public selectRegion(r: Region) { this._selectedRegion.next(r) }

    public selectService(s: Service) { this._selectedService.next(s) }

    public selectedLocalAuthority(l: LocalAuthority) { this._selectedLocalAuthority.next(l) }

    public selectTeam(t: Team) { this._selectedTeam.next(t) }

    public selectSchedule(sched: Schedule) {
        this._selectedSchedule.next(sched);
        this._selectedReport.next(sched.report);
        this._selectedScope.next(sched.scope);
        this._periodStart.next(new Date(sched.runPeriod.item1));
        this._periodEnd.next(new Date(sched.runPeriod.item2));

        switch(sched.scope) {
            case Scope.Team:
                this._selectedTeam.next(this._allTeams.value.find(t => t.teamCode == sched.team.teamCode));
                break;
            case Scope.LocAuth:
                this._selectedLocalAuthority.next(this._allLocalAuthorities.value.find(l => l.ref == sched.localAuthority.ref));
                break;
            case Scope.Service:
                this._selectedService.next(this._allServices.value.find(s => s.id == sched.service.id));
                break;
            case Scope.Region:
                this._selectedRegion.next(this._allRegions.value.find(r => r.id == sched.region.id));
                break;
            default:
                break;
        }
    }

    getReport(x: {"report": Report, "scope": {"team": Team, "locAuth": LocalAuthority, "service": Service, "region": Region},
        "period": { "start": Date, "end": Date}}) {

        this._reportPdfUrl.next(null);

        if (isDevMode()) console.log(this.getReportUrl(x));

        this.http.get(this.getReportUrl(x), { responseType: ResponseContentType.ArrayBuffer })
            .subscribe(res => {
                let objUrl = URL.createObjectURL(new Blob([res.blob()], { type: "application/pdf" }));
                this._reportPdfUrl.next(this.sanitizer.bypassSecurityTrustResourceUrl(objUrl));
            });
    }

    getReportUrl(x: {"report": Report, "scope": {"team": Team, "locAuth": LocalAuthority, "service": Service, "region": Region},
        "period": { "start": Date, "end": Date}}): string {

        var baseUrl = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report?";
        var repUrl = `${baseUrl}reportId=${x.report.id}&periodStart=${Utils.SqlDate(x.period.start)}&periodEnd=${Utils.SqlDate(x.period.end)}`;

        // TODO These should be mutually exclusive
        if (x.scope.team !== null) repUrl += `&teamCode=${x.scope.team.teamCode}`;
        if (x.scope.service !== null) repUrl += `&serviceId=${x.scope.service.id}`;
        if (x.scope.region !== null) repUrl += `&regionId=${x.scope.region.id}`;
        if (x.scope.locAuth !== null) repUrl += `&locAuthRef=${x.scope.locAuth.ref}`;

        return repUrl;
    }

    putSchedule(sched: Schedule) {
        return this.http.put('/api/reporting/schedule', sched).map(res => {
            this.getUserSchedules();
            return res.json() as Schedule;
        });
    }

    subscribeToSchedule(sched: Schedule) {
        return this.http.put('api/reporting/subscribe', sched).map(res => {
            this.getUserSchedules();
            this.getAllSchedules();
            return res.json() as Subscription;
        });
    }
}
