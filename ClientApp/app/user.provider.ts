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
    private _selectedUser = new Subject<AccessUser>();

    public allUsers$ = this._allUsers.asObservable();
    public userInfo$ = this._userInfo.asObservable().distinctUntilChanged((a, b) => a.accountName == b.accountName);
    public selectedUser$ = this._selectedUser.asObservable();

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

    public GetAllUsers(): Promise<AccessUser[]> {
        return this.http.get('/api/user/GetAllUsers').toPromise().then(res => {
            var allUsers = res.json() as AccessUser[];
            this._allUsers.next(allUsers);
            return allUsers;
        });
    }

    public PutUser(user: AccessUser): Observable<AccessUser> {
        return this.http.put('/api/user/PutUser', user).switchMap(res => {
            var resUser = res.json() as AccessUser;
            this._selectedUser.next(resUser);
            return Observable.of(resUser);
        });
    }

    public SelectUser(user: AccessUser) {
        this._selectedUser.next(user);
    }
}