import { Injectable, OnInit } from "@angular/core";
import { Http } from "@angular/http";

import { AccessUser } from "./models/AccessUser";

@Injectable()
export class UserProvider implements OnInit {

    public userInfo: AccessUser;

    constructor(private http: Http) { }

    ngOnInit() {
        this.GetUserInfo();
    }

    public GetUserInfo() {
        this.http.get('/api/user/GetUserInfo').subscribe(res => {
            this.userInfo = res.json() as AccessUser;
            console.log(this.userInfo);
        })
    }
}