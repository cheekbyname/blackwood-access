import { Injectable, OnInit } from "@angular/core";
import { Http } from "@angular/http";

import { AccessUser } from "./models/AccessUser";

import { Subject } from "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserProvider implements OnInit {

    private _userInfo = new Subject<AccessUser>();
    private _allUsers = new Subject<AccessUser[]>();

    public allUsers$ = this._allUsers.asObservable();
    public userInfo$ = this._userInfo.asObservable().distinctUntilChanged((a, b) => a.accountName == b.accountName);

    constructor(private http: Http) { }

    ngOnInit() {
        this.GetAllUsers();
        this.GetUserInfo();
    }

    public GetUserInfo(): Promise<AccessUser> {
        return this.http.get('/api/user/GetUserInfo').toPromise().then(res => {
            var user = res.json() as AccessUser;
            this._userInfo.next(user);
            return user;
        });
    }

    public GetAllUsers() {
        this.http.get('/api/user/GetAllUsers').subscribe(res => {
            this._allUsers.next(res.json() as AccessUser[]);
        });
    }

    public PutUser(user: AccessUser): Observable<AccessUser> {
        return this.http.put('/api/user/PutUser', user).switchMap(res => Observable.of(res.json() as AccessUser));
    }
}