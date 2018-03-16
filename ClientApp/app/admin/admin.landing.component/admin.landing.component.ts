import { Component } from "@angular/core";

import { AccessUser } from "../../models/AccessUser";

import { UserProvider } from "../../user.provider";

@Component({
    selector: 'admin-landing',
    templateUrl: 'admin.landing.component.html',
    styleUrls: ['admin.landing.component.css']
})
export class AdminLandingComponent {
    constructor(private userPro: UserProvider){
        this.userPro.userInfo$.subscribe(ui => this.user = ui);
        this.userPro.GetUserInfo();
    }

    user: AccessUser;
}