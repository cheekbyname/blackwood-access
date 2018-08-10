import { Component } from "@angular/core";

import { AccessUser } from "../../models/AccessUser";

import { UserProvider } from "../../user.provider";

@Component({
    selector: 'integration-landing',
    templateUrl: 'integration.landing.component.html',
    styleUrls: ['integration.landing.component.css']
})
export class IntegrationLandingComponent {
    constructor(private userPro: UserProvider){
        this.userPro.userInfo$.subscribe(ui => this.user = ui);
        this.userPro.GetUserInfo();
    }

    user: AccessUser;
}