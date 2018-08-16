import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/integration/User";

@Injectable()
export class IntegrationProvider {
    constructor(private http: Http) {
        this.getAllUsers().subscribe(au => { });
    }

    private _integrationUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

    public integrationUsers$: Observable<User[]> = this._integrationUsers.asObservable()
        .filter(x => x != null).distinctUntilChanged();

    getAllUsers(): Observable<User[]> {
        this._integrationUsers.next(null);
        return this.http.get('/api/integration/allusers', null).map(res => {
            var au = res.json() as User[];
            this._integrationUsers.next(au);
            return au;
        });
    }

    getUserByPersonCode(person: number): Observable<User> {
        return this.http.get(`api/integration/auser?personCode=${person}`, null).map(res => res.json() as User);
    }

    mapUser(user: User): Observable<User> {
        return this.http.put(`api/integration/mapuser`, user).map(res => {
            this.getAllUsers().subscribe(au => this._integrationUsers.next(au));
            return res.json() as User;
        });
    }
}
