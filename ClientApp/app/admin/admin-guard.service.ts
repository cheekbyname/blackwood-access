import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { AccessUser } from "../models/accessuser";
import { UserProvider } from "../user.provider";

@Injectable()
export class AdminGuard implements CanActivate {

    user: AccessUser;

    constructor(private userPro: UserProvider) { }

    canActivate(): Promise<boolean> {
        return new Promise((res) => {
            if (!this.user) {
                this.userPro.GetUserInfo().then(ui => {
                    console.log(ui);
                    this.user = ui;
                    res(ui.isAdmin);
                });
            } else {
                res(this.user.isAdmin);
            }
        });
    }
}