import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { IncidentSummary } from "./models/IncidentSummary";

@Injectable()
export class AccidentProvider {
    constructor(private http: Http) {
        this.getSummaries();
    }

    private _summaries = new BehaviorSubject<IncidentSummary[]>(null);

    public summaries$ = this._summaries.asObservable().distinctUntilChanged();

    public getSummaries() {
        this.http.get('api/accident/summaries').toPromise().then(res => {
            this._summaries.next(res.json());
        });
    }
}