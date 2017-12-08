import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Incident } from "./models/Incident";
import { IncidentSummary } from "./models/IncidentSummary";

@Injectable()
export class AccidentProvider {
    constructor(private http: Http) {
        this.getSummaries(this.searchTerm).catch(err => this.handle(err));
    }

    private _errors = new BehaviorSubject<string>(null);
    private _incident = new BehaviorSubject<Incident>(null);
    private _summaries = new BehaviorSubject<IncidentSummary[]>(null);

    private searchTerm: string = "";

    public errors$ = this._errors.asObservable();
    public incident$ = this._incident.asObservable().distinctUntilChanged();
    public summaries$ = this._summaries.asObservable().debounceTime(500).distinctUntilChanged();

    public getSummaries(term: string): Promise<IncidentSummary[]> {
        var url = 'api/accident/summaries' + ((term && term.length > 0) ? '/' + term : '');
        return this.http.get(url).toPromise()
            .catch(err => {
                this._errors.next("Error retrieving summaries");
                return Promise.reject("Error retrieving summaries");
            })
            .then(res => {
                this._summaries.next(res.json());
                return res.json() as IncidentSummary[];
            });
    }

    public getIncident(id: number): Promise<Incident> {
        var url = 'api/accident/incident/' + id;
        return this.http.get(url).toPromise()
            .catch(err => {
                this._errors.next('Error retrieving Incident');
                return Promise.reject('Error retrieving Incident');
            })
            .then(res => {
                console.log(res.json());
                this._incident.next(res.json());
                return res.json() as Incident;
            });
    }

    public setSearchTerm(term: string) {
        this.searchTerm = term;
        this.getSummaries(term).catch(err => this.handle(err));
    }

    private handle(err: any) {
        // TODO Consider logging or whatever
    }
}
