import { Injectable, OnInit } from "@angular/core";
import { Http } from "@angular/http";

import { AccessUser } from "./models/AccessUser";

import { Observable, Subject } from "rxjs/Rx";

@Injectable()
export class UserProvider implements OnInit {

    public userInfo: AccessUser;
    private _allUsers = new Subject<AccessUser[]>();

    public allUsers$ = this._allUsers.asObservable();

    constructor(private http: Http) { }

    ngOnInit() {
        this.GetUserInfo();
    }

    public GetUserInfo() {
        this.http.get('/api/user/GetUserInfo').subscribe(res => {
            this.userInfo = res.json() as AccessUser;
        })
    }

    public GetAllUsers() {
        this.http.get('/api/user/GetAllUsers').subscribe(res => {
            this._allUsers.next(res.json() as AccessUser[]);
        });
    }

    public PutUser(user: AccessUser) {
        this.http.put('/api/user/PutUser', user).subscribe(res => {
            if (res.status !== 200) {
                // TODO Handle in some meaningful way
                console.log(res);
            }
        });
    }
}