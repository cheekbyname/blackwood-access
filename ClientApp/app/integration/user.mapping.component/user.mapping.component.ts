import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { User } from '../../models/integration/User';
import { IntegrationProvider } from "../integration.provider";

@Component({
    selector: 'user-mapping',
    templateUrl: 'user.mapping.component.html',
    styleUrls: ['user.mapping.component.css']
})
export class UserMappingComponent {
    constructor(private route: ActivatedRoute, private ip: IntegrationProvider) {
        this.route.params.subscribe(p => {
            var personCode = p['person'];
            this.ip.getUserByPersonCode(personCode).subscribe(u => this.user = u);
        });
    }

    user: User
}
