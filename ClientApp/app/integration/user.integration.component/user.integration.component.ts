import { Component } from "@angular/core";

import { User } from "../../models/integration/User";

import { IntegrationProvider } from "../integration.provider";

@Component({
    selector: 'user-integration',
    templateUrl: './user.integration.component.html',
    styleUrls: ['./user.integration.component.css']
})
export class UserIntegrationComponent {
    constructor(private ip: IntegrationProvider) {
        ip.integrationUsers$.subscribe(au => this.users = au);
    }

    users: User[];
}