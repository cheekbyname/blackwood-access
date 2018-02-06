import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { BehaviorSubject } from "rxjs/Rx";

import { Report } from "../models/reporting/Report";
import { Schedule } from "../models/reporting/Schedule";

@Injectable()
export class ReportingProvider {
    constructor(private http: Http) {
        this.getUserSchedules();
    }

    private _reports = new BehaviorSubject<Report[]>(null);
    private _allSchedules = new BehaviorSubject<Schedule[]>(null);
    private _userSchedules = new BehaviorSubject<Schedule[]>(null);

    public reports$ = this._reports.asObservable();
    public allSchedules$ = this._allSchedules.asObservable();
    public userSchedules$ = this._userSchedules.asObservable();

    public getAllReports() {
        this.http.get('/api/reporting/allReports').subscribe(res => this._reports.next(res.json() as Report[]));
    }

    public getUserSchedules() {
        this.http.get('/api/reporting/schedulesForUser').subscribe(res => this._userSchedules.next(res.json() as Schedule[]));
    }
}