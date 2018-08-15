import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import { Utils } from "../../Utils";

import { User } from '../../models/integration/User';
import { IntegrationProvider } from "../integration.provider";

@Component({
    selector: 'user-mapping',
    templateUrl: 'user.mapping.component.html',
    styleUrls: ['user.mapping.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserMappingComponent {
    constructor(private route: ActivatedRoute, private ip: IntegrationProvider, public fb: FormBuilder) {
        this.route.params.subscribe(p => {
            var personCode = p['person'];
            this.ip.getUserByPersonCode(personCode).subscribe(u => {
                this.user = u;
                this.form = this.fb.group(this.getFormControls());
            });
        });
    }

    public user: User;
    public form: FormGroup;
    public Utils = Utils;

    private getFormControls() {
        return {
            name: [{ value: `${this.user.firstName} ${this.user.lastName}`, disabled: true }],
            dateOfBirth: [{ value: this.Utils.FormatDate(this.user.birthDate), disabled: true }],
            role: [{ value: this.roleDesc(this.user.role), disabled: true }],
            integrationId: [{ value: this.user.id, disabled: true }],
            staffPlanId: [{ value: this.user.personCode, disabled: true }],
            careSysId: [{ value: this.user.careSysGuid, disabled: true }],
            cleverCogsId: [{ value: this.user.cleverCogsUserID, disabled: true }],
            dynamicsId: [{ value: 'N/A', disabled: true }],
            uhId: [{ value: 'N/A', disabled: true }]
        };
    }

    public roleDesc(role: string): string {
		switch (role) {
			case "spt":
				return "Staff";
			case "usr":
				return "Client";
		}
	}
}
