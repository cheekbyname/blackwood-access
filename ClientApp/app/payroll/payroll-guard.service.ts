import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AccessUser } from "../models/accessuser";
import { UserProvider } from "../user.provider";

@Injectable()
export class PayrollGuard implements CanActivate {

    user: AccessUser;

    constructor(private userPro: UserProvider, private router: Router) { }

    canActivate(): Promise<boolean> {
        return new Promise((res) => {
            if (!this.user) {
                this.userPro.GetUserInfo().then(ui => {
                    this.user = ui;
                    res(ui.isPayrollUser);
                });
            } else {
                res(this.user.isPayrollUser);
            }
        }).then((res) => {
            if (!this.user.isPayrollUser) this.router.navigate(['no-auth']);
            return res;
        });
    }
}