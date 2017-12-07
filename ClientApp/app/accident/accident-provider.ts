import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { IncidentSummary } from "./models/IncidentSummary";

@Injectable()
export class AccidentProvider {
    constructor(private http: Http) {
        this.getSummaries(this.searchTerm);
    }

    private _summaries = new BehaviorSubject<IncidentSummary[]>(null);

    private searchTerm: string ="";

    public summaries$ = this._summaries.asObservable().debounceTime(250).distinctUntilChanged();

    public getSummaries(term: string) {
        var url = 'api/accident/summaries' + ((term && term.length > 0) ? '/' + term : '');
        this.http.get(url).toPromise().then(res => {
            this._summaries.next(res.json());
        });
    }

    public setSearchTerm(term: string) {
        this.searchTerm = term;
        this.getSummaries(term);
    }
}
