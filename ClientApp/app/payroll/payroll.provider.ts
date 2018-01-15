import { Injectable, isDevMode, OnDestroy } from "@angular/core";
import { Http } from "@angular/http";
import { BehaviorSubject, Observable, Subscription } from "rxjs/Rx";
import "rxjs/add/operator/toPromise";

import { AccessUser } from "../models/AccessUser";
import { Adjustment } from "../models/Adjustment";
import { Carer } from "../models/Carer";
import { CarerContract } from "../models/Contract";
import { Locale, LOC_EN } from "../models/Locale";
import { Payroll } from "../models/Payroll";
import { PayrollCodeMap } from "../models/PayrollCodeMap";
import { PayrollCodeType } from "../models/PayrollCodeType";
import { Summary } from "../models/Summary";
import { Team } from "../models/Team";
import { Timesheet } from "../models/Timesheet";
import { ValidationResult } from "../models/Validation";

import { UserProvider } from "../user.provider";

@Injectable()
export class PayrollProvider implements OnDestroy {

    private _weekCommencing = new BehaviorSubject<Date>(new Date());
    private _periodStart = new BehaviorSubject<Date>(null);
    private _periodFinish = new BehaviorSubject<Date>(null);
    private _selectedTeam = new BehaviorSubject<Team>(null);
    private _selectedCarer = new BehaviorSubject<Carer>(null);
    private _teams = new BehaviorSubject<Team[]>(null);
    private _carers = new BehaviorSubject<Carer[]>(null);
    private _adjustments = new BehaviorSubject<Adjustment[]>(null);
    private _timesheet = new BehaviorSubject<Timesheet>(null);
    private _summaries = new BehaviorSubject<Summary[]>(null);
    private _validation = new BehaviorSubject<ValidationResult>(null);
    private _export = new BehaviorSubject<Payroll[]>(undefined);
    private _codeMap = new BehaviorSubject<PayrollCodeMap[]>(undefined);
    private _codeTypes = new BehaviorSubject<PayrollCodeType[]>(undefined);
    private _errorMessage = new BehaviorSubject<string>(undefined);

    weekCommencing$ = this._weekCommencing.asObservable().distinctUntilChanged();
    periodStart$ = this._periodStart.asObservable().distinctUntilChanged();
    periodFinish$ = this._periodFinish.asObservable().distinctUntilChanged();
    selectedTeam$ = this._selectedTeam.asObservable()
        .distinctUntilChanged((a: Team, b: Team) => a !== null && b !== null && a.teamCode === b.teamCode);
    selectedCarer$ = this._selectedCarer.asObservable()
        .distinctUntilChanged((a: Carer, b: Carer) => a !== null && b !== null && a.carerCode === b.carerCode);
    validation$ = this._validation.asObservable();
    export$ = this._export.asObservable();
    codeMap$ = this._codeMap.asObservable();
    codeTypes$ = this._codeTypes.asObservable();
    errorMessage$ = this._errorMessage.asObservable();

    teams$ = this._teams.asObservable();
    carers$ = this._carers.asObservable();
    adjustments$ = this._adjustments.asObservable();
    timesheet$ = this._timesheet.asObservable();
    summaries$ = this._summaries.asObservable();

    week$: Observable<{ "weekCommencing": Date, "carer": Carer }>;
    period$: Observable<{ "team": Team, "start": Date, "finish": Date }>;
    subs: Subscription[] = [];

    public locale: Locale = LOC_EN;
    public absenceCodes: number[] = [108, 109];
    public unpaidCodes: number[] = [123, 110, 98];

    private user: AccessUser;

    constructor(public http: Http, private userPro: UserProvider) {

        Observable
            .combineLatest(this.periodStart$, this.selectedTeam$, (wc: Date, tm: Team) => {
                return { "periodStart": wc, "selectedTeam": tm };
            })
            .filter(x => x.selectedTeam !== null && x.periodStart !== null)
            .distinctUntilChanged((a, b) => {
                return (a.selectedTeam.teamCode === b.selectedTeam.teamCode)
                    && (a.periodStart.toLocaleDateString() === b.periodStart.toLocaleDateString());
            })
            .subscribe(x => {
                if (x.selectedTeam !== null && x.selectedTeam.teamCode && x.periodStart) {
                    // TODO Consider suspending this.weekSub until carers refreshed
                    this.getCarers(x.selectedTeam, x.periodStart);
                }
            });

        this.week$ = Observable
            .combineLatest(this.weekCommencing$, this.selectedCarer$, (wc, carer) => {
                return { "weekCommencing": wc, "carer": carer }
            })
            .filter(x => x.carer !== null && x.carer !== undefined && x.weekCommencing !== null)
            .distinctUntilChanged((a, b) => {
                return (a.carer.carerCode === b.carer.carerCode)
                    && (a.weekCommencing.toLocaleDateString() === b.weekCommencing.toLocaleDateString());
            });

        this.subscribeTo(this.week$, this._timesheet, this.getTimesheet);

        this.period$ = Observable
            .combineLatest(this.selectedTeam$, this.periodStart$, this.periodFinish$, (team, start, finish) => {
                return { "team": team, "start": start, "finish": finish }
            })
            .filter(x => x.team !== null && x.start !== null && x.finish !== null)
            .distinctUntilChanged((a, b) => {
                return (a.team.teamCode === b.team.teamCode)
                    && (a.start.toLocaleDateString() === b.start.toLocaleDateString())
                    && (a.finish.toLocaleDateString() === b.finish.toLocaleDateString());
            });

        this.subscribeTo(this.period$, this._summaries, this.getSummaries);
        this.subscribeTo(this.period$, this._adjustments, this.getTimesheetAdjustmentsByTeam);
        this.subscribeTo(this.period$, this._validation, this.getValidationResult);
        this.subscribeTo(this.period$, this._export, this.getPayrollExport);

        this.userPro.userInfo$.subscribe(x => this.user = x);

        this.getTeams();
        this.getCodeMap();
        this.getCodeTypes();
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    subscribeTo(obs: Observable<any>, sub: BehaviorSubject<any>, req: Function) {
        this.subs.push(obs
            .switchMap(x => {
                sub.next(null);
                return req.call(this, x);
            })
            .catch(e => {
                sub.error(e);
                return Observable.throw(e);
            })
            .subscribe(r => sub.next(r)));
    }

    selectWeekCommencing(dt: Date) {
        this._weekCommencing.next(this.getWeekCommencingFromDate(dt));
    }

    selectTeam(team: Team) {
        this._selectedTeam.next(team);
    }

    selectCarer(carer: Carer) {
        this._selectedCarer.next(carer);
    }

    setPeriodStart(dt: Date) {
        this._periodStart.next(dt);
    }

    setPeriodFinish(dt: Date) {
        this._periodFinish.next(dt);
    }

    setPeriod(dt: Date) {
        // Get first and last of month from a selected date
        // TODO Refactor this to take Dundee's pathological timetable into account
        var start = new Date(dt.getFullYear(), dt.getMonth(), 1);
        var finish = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);

        this.setPeriodFinish(finish);
        this.setPeriodStart(start);
    }

    getTeams() {
        var teams: Team[];
        this.http.get('/api/payroll/teams').subscribe(res => {
            var teams = res.json();
            this._teams.next(teams);
        });
    }

    getCarers(tm: Team, wc: Date) {
        var tsUrl = `/api/payroll/carersbyteam?teamCode=${tm.teamCode}&periodStart=${this.sqlDate(wc)}`;
        if (isDevMode()) console.log(tsUrl);
        this.http.get(tsUrl).subscribe(res => {
            var carers = res.json() as Carer[];
            this._selectedCarer.next(null);
            this._carers.next(carers);
        });
    }

    getTimesheet(x: { carer: Carer, weekCommencing: Date }): Observable<Timesheet> {
        var tsUrl = `/api/payroll/timesheet?carerCode=${x.carer.carerCode}&weekCommencing=${this.sqlDate(x.weekCommencing)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as Timesheet)
            .catch(err => Observable.throw(err));
    }

    getTimesheetAdjustmentsByTeam(x: { team: Team, start: Date, finish: Date }): Observable<Adjustment[]> {
        var tsUrl = `/api/payroll/GetTimesheetAdjustmentsByTeam?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodEnd=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as Adjustment[])
            .catch(err => Observable.throw(err));
    }

    getSummaries(x: { team: Team, start: Date, finish: Date }): Observable<Summary[]> {
        var tsUrl = `/api/payroll/summaries?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodEnd=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as Summary[])
            .catch(err => Observable.throw(err));
    }

    getPayrollExport(x: { team: Team, start: Date, finish: Date }): Observable<Payroll[]> {
        var tsUrl = `/api/payroll/getPayrollData?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodFinish=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as Payroll[])
            .catch(err => Observable.throw(err));
    }

    getValidationResult(x: { team: Team, start: Date, finish: Date }): Observable<ValidationResult> {
        var tsUrl = `/api/payroll/validate?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodFinish=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as ValidationResult)
            .catch(err => Observable.throw(err));
    }

    getCodeMap() {
        var url = '/api/payroll/codeMap';
        this.http.get(url).subscribe(res => {
            this._codeMap.next(res.json() as PayrollCodeMap[]);
        });
    }

    putCodeMap(map: PayrollCodeMap) {
        var url = '/api/payroll/codeMap';
        return this.http.put(url, map);
    }

    getCodeTypes() {
        var url = 'api/payroll/codeTypes';
        this.http.get(url).subscribe(res => {
            this._codeTypes.next(res.json() as PayrollCodeType[]);
        });
    }

    public sqlDate(date: Date): string {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + date.getDate();
    }

    // Convenience methods
    public timeFromDate(dt: Date): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }

    public displayTime(mins: number): string {
        if (mins < 0) {
            return Math.ceil(mins / 60) + "h " + (mins % 60) + "m";
        }
        return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
    }

    public displayDate(date: Date): string {
        return new Date(date).toLocaleDateString();
    }

    public teamForContract(contractCode: number, cons: CarerContract[]): string {
        var contract = cons.find(con => con.contractCode === contractCode);
        return contract ? contract.teamDesc : "";
    }

    public dateOrd(wc: Date, offset: number): string {
        var dt = new Date(wc);
        dt.setDate(dt.getDate() + offset);
        var dy = dt.getDate().toString();
        if ((dy.length > 1) && (dy.substr(0, 1) == '1')) return dy + 'th';
        switch (dy.substr(dy.length - 1)) {
            case "1":
                return dy + "st";
            case "2":
                return dy + "nd";
            case "3":
                return dy + "rd";
            default:
                return dy + "th";
        }
    }

    public monthOf(wc: Date, offset: number): string {
        var dt = new Date(wc);
        dt.setDate(dt.getDate() + offset);
        return this.locale.monthNames[dt.getMonth()];
    }

    public getWeekCommencingFromDate(dt: Date): Date {
        var dow = dt.getDay() || 7;
        if (dow !== 1) dt.setHours(-24 * (dow - 1));
        return dt;
    }

    public rejectAdjustment(adj: Adjustment): Promise<Adjustment> {
        adj.authorised = null;
        adj.authorisedBy = null;
        adj.rejected = new Date(Date.now());
        adj.rejectedBy = this.user.accountName;
        return this.updateAdjustment(adj);
    }

    public approveAdjustment(adj: Adjustment, sendNow: boolean): Promise<Adjustment> {
        adj.authorised = new Date(Date.now());
        adj.authorisedBy = this.user.accountName;
        adj.rejected = null;
        adj.rejectedBy = null;
        if (sendNow) {
            if (isDevMode()) {
                console.log("Adding new Adjustment via API");
                console.log(adj);
            }
            return this.updateAdjustment(adj);
        } else {
            return Promise.resolve(adj);
        }
    }

    public putAdjustment(adj: Adjustment): Promise<Adjustment> {
        var tsUrl = '/api/payroll/AddTimesheetAdjustment';
        return this.http.put(tsUrl, adj).toPromise().then((res) => {
            return Promise.resolve(res.json() as Adjustment);
        });
    }

    private updateAdjustment(adj: Adjustment): Promise<Adjustment> {
        return new Promise<Adjustment>((res, rej) => {
            this.http.put('api/payroll/UpdateTimesheetAdjustment', adj).subscribe((res) => {
                if (res.status == 200) {
                    return Promise.resolve(res.json() as Adjustment);
                } else {
                    return Promise.reject(null);
                }
            });
        });
    }
}