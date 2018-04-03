import { Injectable, isDevMode } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { BehaviorSubject, Observable } from "rxjs/Rx";

import { Report } from "../models/reporting/Report";
import { Schedule } from "../models/reporting/Schedule";
import { Scope } from "../models/reporting/Enums";
import { Service } from "../models/reporting/Service";
import { Team } from "../models/payroll/Team";
import { Region } from "../models/reporting/Region";

import { Utils } from "../Utils";

@Injectable()
export class ReportingProvider {
    constructor(private http: Http, private sanitizer: DomSanitizer) {
        this.getUserSchedules();
        this.getAllReports();

        this.reports$.filter(reps => reps !== null && reps !== undefined).subscribe(reps => this.reports = reps);
    }

    private reports: Report[];

    private _reports = new BehaviorSubject<Report[]>(null);
    private _allSchedules = new BehaviorSubject<Schedule[]>(null);
    private _userSchedules = new BehaviorSubject<Schedule[]>(null);

    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodEnd = new BehaviorSubject<Date>(null);
    private _selectedReport = new BehaviorSubject<Report>(null);
    private _selectedSchedule = new BehaviorSubject<Schedule>(null);

    private _selectedScope = new BehaviorSubject<Scope>(null);
    private _selectedTeam = new BehaviorSubject<Team>(null);
    private _selectedService = new BehaviorSubject<Service>(null);
    private _selectedRegion = new BehaviorSubject<Region>(null);

    private _reportPdfUrl = new BehaviorSubject<SafeResourceUrl>(null);
    
    public reports$ = this._reports.asObservable();
    public allSchedules$ = this._allSchedules.asObservable();
    public userSchedules$ = this._userSchedules.asObservable();
    public periodStart$ = this._periodStart.asObservable();
    public periodEnd$ = this._periodEnd.asObservable();
    public selectedReport$ = this._selectedReport.asObservable();
    public selectedSchedule$ = this._selectedSchedule.asObservable();
    public selectedScope$ = this._selectedScope.asObservable();
    public selectedTeam$ = this._selectedTeam.asObservable();
    public selectedService$ = this._selectedService.asObservable();
    public selectedRegion$ = this._selectedRegion.asObservable();

    public reportPdfUrl$ = this._reportPdfUrl.asObservable();

    public reportScope$ = Observable.combineLatest(this.selectedTeam$, this.selectedService$, this.selectedRegion$, (t, s, r) => {
            return { "team": t, "service": s, "region": r }
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
        .subscribe(x => this.getReport(x));

    public getAllReports() {
        this.http.get('/api/reporting/allReports').subscribe(res => this._reports.next(res.json() as Report[]));
    }

    public getUserSchedules() {
        this.http.get('/api/reporting/schedulesForUser').subscribe(res => this._userSchedules.next(res.json() as Schedule[]));
    }

    public selectReport(rep: Report) {
        this._selectedReport.next(this.reports.find(r => r.id === rep.id));
    }

    public selectPeriodStart(dt: Date) {
        this._periodStart.next(dt);
    }

    public selectPeriodEnd(dt: Date) {
        this._periodEnd.next(dt);
    }

    public selectScope(sc: Scope) {
        this._selectedScope.next(sc);
    }

    public selectSchedule(sched: Schedule) {
        this._selectedSchedule.next(sched);
        this._selectedReport.next(sched.report);
        this._selectedScope.next(sched.scope);
        this._periodStart.next(new Date(sched.runPeriod.item1));
        this._periodEnd.next(new Date(sched.runPeriod.item2));

        switch(sched.scope) {
            case Scope.Team:
                this._selectedTeam.next(sched.team);
                break;
            case Scope.Service:
                this._selectedService.next(sched.service);
                break;
            case Scope.Region:
                this._selectedRegion.next(sched.region);
                break;
            default:
                break;
        }
    }

    getReport(x: {"report": Report, "scope": {"team": Team, "service": Service, "region": Region}, "period": { "start": Date, "end": Date}}) {

        this._reportPdfUrl.next(null);

        var baseUrl = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report?";
        var repUrl = `${baseUrl}reportId=${x.report.id}&periodStart=${Utils.SqlDate(x.period.start)}&periodEnd=${Utils.SqlDate(x.period.end)}`;

        if (x.scope.team !== null) repUrl += `&teamCode=${x.scope.team.teamCode}`;
        if (x.scope.service !== null) repUrl += `&serviceId=${x.scope.service.id}`;
        if (x.scope.region !== null) repUrl += `&regionId=${x.scope.region.id}`;

        if (isDevMode()) console.log(repUrl);

        this.http.get(repUrl, { responseType: ResponseContentType.ArrayBuffer })
            .subscribe(res => {
                let objUrl = URL.createObjectURL(new Blob([res.blob()], { type: "application/pdf" }));
                this._reportPdfUrl.next(this.sanitizer.bypassSecurityTrustResourceUrl(objUrl));
            });
    }
}