import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { BehaviorSubject } from 'rxjs';

import { Category } from "./models/Category";
import { Incident } from "./models/Incident";
import { IncidentSummary } from "./models/IncidentSummary";
import { Location } from "./models/Location";
import { Person } from "./models/Person";
import { Type } from "./models/Type";

@Injectable()
export class AccidentProvider {
    constructor(private http: Http) {
        this.getSummaries(this.searchTerm).catch(err => this.handle(err));
        this.getLocations().catch(err => this.handle(err));
        this.getCategories().catch(err => this.handle(err));
        this.getTypes().catch(err => this.handle(err));
        this.getPeople().catch(err => this.handle(err));
    }

    private _errors = new BehaviorSubject<string>(null);
    private _categories = new BehaviorSubject<Category[]>(null);
    private _incident = new BehaviorSubject<Incident>(null);
    private _summaries = new BehaviorSubject<IncidentSummary[]>(null);
    private _locations = new BehaviorSubject<Location[]>(null);
    private _types = new BehaviorSubject<Type[]>(null);
    private _people = new BehaviorSubject<Person[]>(null);

    private searchTerm: string = "";

    public errors$ = this._errors.asObservable();
    public categories$ = this._categories.asObservable();
    public incident$ = this._incident.asObservable();
    public summaries$ = this._summaries.asObservable().distinctUntilChanged();
    public locations$ = this._locations.asObservable();
    public types$ = this._types.asObservable();
    public people$ = this._people.asObservable();

    public setSearchTerm(term: string) {
        this.searchTerm = term;
        this.getSummaries(term).catch(err => this.handle(err));
    }

    private handle(err: any) {
        // TODO Consider logging or whatever
        this._errors.next(err);
        console.log(err);
    }

    public getSummaries(term: string): Promise<IncidentSummary[]> {
        var url = 'api/accident/summaries' + ((term && term.length > 0) ? '/' + term : '');
        return this.http.get(url).toPromise()
            .catch(() => {
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
            .catch(() => {
                    return Promise.reject('Error retrieving Incident');
                })
            .then(res => {
                this._incident.next(res.json());
                return res.json() as Incident;
            });
    }

    public getLocations(): Promise<Location[]> {
        var url = 'api/accident/locations';
        return this.http.get(url).toPromise()
            .catch(() => {
                    return Promise.reject('Error retrieving Locations');
                })
            .then(res => {
                this._locations.next(res.json());
                return res.json() as Location[];
            });
    }

    public getCategories(): Promise<Category[]> {
        var url = 'api/accident/categories';
        return this.http.get(url).toPromise()
            .catch(() => {
                    return Promise.reject('Error retrieving Categories');
                })
            .then(res => {
                this._categories.next(res.json());
                return res.json() as Category[];
            });
    }

    public getTypes(): Promise<Type[]> {
        var url = 'api/accident/types';
        return this.http.get(url).toPromise()
            .catch(() => {
                    return Promise.reject('Error retrieving Types');
                })
            .then(res => {
                this._types.next(res.json());
                return res.json() as Type[];
            })
    }

    public getPeople(): Promise<Person[]> {
        var url = 'api/accident/people';
        return this.http.get(url).toPromise()
            .catch(() => {
                    return Promise.reject('Error retrieving People');
                })
            .then(res => {
                this._people.next(res.json());
                return res.json() as Person[];
            });
    }
}
