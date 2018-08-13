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

    public integrationUsers$: Observable<User[]> = this._integrationUsers.asObservable();

    getAllUsers() {
        return this.http.get('/api/integration/allusers', null).map(res => {
            var au = res.json() as User[];
            this._integrationUsers.next(au);
            return au;
        });
    }
}