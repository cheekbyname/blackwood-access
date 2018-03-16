import { Component } from "@angular/core";

import { AccessUser } from "../../models/AccessUser";

import { UserProvider } from "../../user.provider";

@Component({
    selector: 'report-landing',
    templateUrl: 'reporting.landing.component.html',
    styleUrls: ['reporting.landing.component.css']
})
export class ReportingLandingComponent {
    constructor(private userPro: UserProvider){
        this.userPro.userInfo$.subscribe(ui => this.user = ui);
        this.userPro.GetUserInfo();
    }

    user: AccessUser;
}