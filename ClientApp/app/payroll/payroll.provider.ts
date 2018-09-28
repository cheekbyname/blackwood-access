import { Injectable, isDevMode, OnDestroy } from "@angular/core";
import { Http } from "@angular/http";

import { BehaviorSubject, Observable, Subscription } from "rxjs";
import "rxjs/add/operator/toPromise";

import { AccessUser } from "../models/AccessUser";
import { Adjustment } from "../models/payroll/Adjustment";
import { Availability } from "../models/payroll/Availability";
import { BookingTypeAnalysis } from "../models/payroll/BookingTypeAnalysis";
import { BreakPolicy } from "../models/payroll/BreakPolicy";
import { Carer } from "../models/payroll/Carer";
import { CarerContract } from "../models/payroll/Contract";
import { Export } from "../models/payroll/Export";
import { Locale, LOC_EN } from "../models/Locale";
import { PayrollCodeMap } from "../models/payroll/PayrollCodeMap";
import { PayrollCodeType } from "../models/payroll/PayrollCodeType";
import { Summary } from "../models/payroll/Summary";
import { Team } from "../models/payroll/Team";
import { TeamPeriod } from "../models/payroll/TeamPeriod";
import { Timesheet } from "../models/payroll/Timesheet";
import { ValidationResult } from "../models/payroll/Validation";

import { UserProvider } from "../user.provider";

@Injectable()
export class PayrollProvider implements OnDestroy {

    private _adjustments = new BehaviorSubject<Adjustment[]>(null);
    private _analysis = new BehaviorSubject<BookingTypeAnalysis[]>(null);
    private _carers = new BehaviorSubject<Carer[]>(null);
    private _codeMap = new BehaviorSubject<PayrollCodeMap[]>(undefined);
    private _codeTypes = new BehaviorSubject<PayrollCodeType[]>(undefined);
    private _errorMessage = new BehaviorSubject<string>(undefined);
    private _export = new BehaviorSubject<Export[]>(undefined);
    private _periodFinish = new BehaviorSubject<Date>(null);
    private _periodStart = new BehaviorSubject<Date>(null);
    private _selectedCarer = new BehaviorSubject<Carer>(null);
    private _selectedTeam = new BehaviorSubject<Team>(null);
    private _summaries = new BehaviorSubject<Summary[]>(null);
    private _teamPeriod = new BehaviorSubject<TeamPeriod>(null);
    private _teams = new BehaviorSubject<Team[]>(null);
    private _timesheet = new BehaviorSubject<Timesheet>(null);
    private _validation = new BehaviorSubject<ValidationResult>(null);
    private _weekCommencing = new BehaviorSubject<Date>(new Date());

    adjustments$ = this._adjustments.asObservable();
    analysis$ = this._analysis.asObservable();
    carers$ = this._carers.asObservable();
    codeMap$ = this._codeMap.asObservable().filter(map => map !== undefined);
    codeTypes$ = this._codeTypes.asObservable();
    errorMessage$ = this._errorMessage.asObservable();
    export$ = this._export.asObservable();
    periodFinish$ = this._periodFinish.asObservable().distinctUntilChanged();
    periodStart$ = this._periodStart.asObservable().distinctUntilChanged();
    selectedCarer$ = this._selectedCarer.asObservable()
        .filter(a => a !== null && a !== undefined)
        .distinctUntilChanged((a: Carer, b: Carer) => a !== null && b !== null && a.carerCode === b.carerCode);
    selectedTeam$ = this._selectedTeam.asObservable()
        .distinctUntilChanged((a: Team, b: Team) => a !== null && b !== null && a.teamCode === b.teamCode);
    summaries$ = this._summaries.asObservable();
    teamPeriod$ = this._teamPeriod.asObservable();
    teams$ = this._teams.asObservable();
    timesheet$ = this._timesheet.asObservable();
    validation$ = this._validation.asObservable();
    weekCommencing$ = this._weekCommencing.asObservable().distinctUntilChanged();

    week$: Observable<{ "weekCommencing": Date, "carer": Carer }>;
    period$: Observable<{ "team": Team, "start": Date, "finish": Date }>;
    subs: Subscription[] = [];

    public readonly locale: Locale = LOC_EN;

    // Annual Leave, Sickness Absence, Unpaid Leave, Maternity Leave, Special Leave
    public readonly absenceCodes: number[] = [108, 109, 110, 128, 176];
    public readonly unpaidCodes: number[] = [123, 110, 98];
    public readonly hideableCodes: number[] = [133];    // Travel Time

    private user: AccessUser;

    constructor(public http: Http, private userPro: UserProvider) {

        Observable
            .combineLatest(this.periodStart$, this.selectedTeam$, (wc: Date, tm: Team) => {
                return { "periodStart": wc, "selectedTeam": tm };
            })
            .filter(x => x.selectedTeam !== null && x.periodStart !== null)
            .distinctUntilChanged((a, b) => {
                return (a.selectedTeam.teamCode === b.selectedTeam.teamCode)
                    && (a.periodStart.toLocaleDateString("en-GB") === b.periodStart.toLocaleDateString("en-GB"));
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
                    && (a.weekCommencing.toLocaleDateString("en-GB") === b.weekCommencing.toLocaleDateString("en-GB"));
            });

        this.subscribeTo(this.week$, this._timesheet, this.getTimesheet);

        this.period$ = Observable
            .combineLatest(this.selectedTeam$, this.periodStart$, this.periodFinish$, (team, start, finish) => {
                return { "team": team, "start": start, "finish": finish }
            })
            .filter(x => x.team !== null && x.start !== null && x.finish !== null && x.finish > x.start)
            .distinctUntilChanged((a, b) => {
                return (a.team.teamCode === b.team.teamCode)
                    && (a.start.toLocaleDateString("en-GB") === b.start.toLocaleDateString("en-GB"))
                    && (a.finish.toLocaleDateString("en-GB") === b.finish.toLocaleDateString("en-GB"));
            });

        this.subscribeTo(this.period$, this._teamPeriod, this.getTeamPeriod);

        this.userPro.userInfo$.subscribe(x => this.user = x);

        this.getTeams();
        this.getCodeMap();
        this.getCodeTypes();
        this.getBookingTypeAnalyses();
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

    getPayrollExport(x: { team: Team, start: Date, finish: Date }): Observable<Export[]> {
        var tsUrl = `/api/payroll/getPayrollData?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodFinish=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as Export[])
            .catch(err => Observable.throw(err));
    }

    getValidationResult(x: { team: Team, start: Date, finish: Date }): Observable<ValidationResult> {
        var tsUrl = `/api/payroll/validate?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodFinish=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => res.json() as ValidationResult)
            .catch(err => Observable.throw(err));
    }

    getTeamPeriod(x: {team: Team, start: Date, finish: Date}): Observable<TeamPeriod> {
        var tsUrl = `/api/payroll/summary?teamCode=${x.team.teamCode}&periodStart=${this.sqlDate(x.start)}&periodEnd=${this.sqlDate(x.finish)}`;
        if (isDevMode()) console.log(tsUrl);
        return this.http.get(tsUrl)
            .map(res => {
                var tp = res.json() as TeamPeriod;
                this._summaries.next(tp.summaries);
                this._adjustments.next(tp.adjustments);
                this._validation.next(tp.validationResult);
                this._export.next(tp.currentExports);
                return tp;
            })
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

    getBookingTypeAnalyses() {
        var url = 'api/payroll/bookingTypeAnalyses';
        this.http.get(url).subscribe(res => {
            this._analysis.next(res.json() as BookingTypeAnalysis[]);
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
        return new Date(date).toLocaleDateString("en-GB");
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

    public putApproval(period: TeamPeriod) {
        this.http.put('api/payroll/approvesummary', period).subscribe(res => {
            var tp = res.json() as TeamPeriod;
            this._teamPeriod.next(tp);
        });
    }

    public getBreakPolicyForTeamCode(teamCode: number): BreakPolicy {
        return this._teams.value.find(t => t.teamCode == teamCode).teamBreakPolicy;
    }

    public adjustAvailForBreaks(avail: Availability, contract: CarerContract): number {
		var policy = this.getBreakPolicyForTeamCode(contract.teamCode);
		var breakTime = policy.definitions
			.filter(def => avail.thisMins >= def.minThreshold && !def.paid)
			.map(def => def.breakLength)
			.reduce((acc, cur) => { return acc + cur }, 0);
		return avail.thisMins - breakTime;
	}
}
