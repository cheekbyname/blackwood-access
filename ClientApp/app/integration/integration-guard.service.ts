import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AccessUser } from "../models/AccessUser";
import { UserProvider } from "../user.provider";

@Injectable()
export class IntegrationGuard implements CanActivate {

    user: AccessUser;

    constructor(private userPro: UserProvider, private router: Router) { }

    canActivate(): Promise<boolean> {
        return new Promise((res) => {
            if (!this.user) {
                this.userPro.GetUserInfo().then(ui => {
                    this.user = ui;
                    return Promise.resolve(res(ui.isIntegrationUser));
                });
            } else {
                return Promise.resolve(res(this.user.isIntegrationUser));
            }
        }).then((res: boolean) => {
            if (!this.user.isIntegrationUser) {
                this.router.navigate(['no-auth']);
                return Promise.reject(res);
            } else {
                return Promise.resolve(res);
            }
        });
    }
}