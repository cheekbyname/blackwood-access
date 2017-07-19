import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AccessUser } from "../models/accessuser";
import { UserProvider } from "../user.provider";

@Injectable()
export class PayrollGuard implements CanActivate {

    user: AccessUser;

    constructor(private userPro: UserProvider, private router: Router) {
        // TODO Subscribe to userInfo Observable to handle in-use scenarios
    }

    canActivate(): Promise<boolean> {
        return new Promise((res) => {
            if (!this.user) {
                this.userPro.GetUserInfo().then(ui => {
                    this.user = ui;
                    if (!ui.isPayrollUser) this.router.navigate(['no-auth']);
                    res(ui.isPayrollUser);
                });
            } else {
                if (!this.user.isPayrollUser) this.router.navigate(['no-auth']);
                res(this.user.isPayrollUser);
            }
        });
    }
}