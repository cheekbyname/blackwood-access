import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AccessUser } from "../models/accessuser";
import { UserProvider } from "../user.provider";

@Injectable()
export class AdminGuard implements CanActivate {

    user: AccessUser;

    constructor(private userPro: UserProvider, private router: Router) { }

    canActivate(): Promise<boolean> {
        return new Promise((res) => {
            if (!this.user) {
                this.userPro.GetUserInfo().then(ui => {
                    this.user = ui;
                    res(ui.isAdmin);
                });
            } else {
                res(this.user.isAdmin);
            }
        }).then((res) => {
            if (!this.user.isAdmin) this.router.navigate(['no-auth']);
            return res;
        });
    }
}