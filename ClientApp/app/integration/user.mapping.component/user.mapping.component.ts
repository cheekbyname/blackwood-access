import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import { ConfirmationService } from "primeng/primeng";
import { MessageService } from "primeng/components/common/messageservice";

import { Utils } from "../../Utils";

import { User, GENDERS, ROLES } from '../../models/integration/User';
import { IntegrationProvider } from "../integration.provider";
import { Observable } from "../../../../node_modules/rxjs";

@Component({
    selector: 'user-mapping',
    templateUrl: 'user.mapping.component.html',
    styleUrls: ['user.mapping.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserMappingComponent {
    constructor(private route: ActivatedRoute, private ip: IntegrationProvider, public fb: FormBuilder,
        private ms: MessageService, private cs: ConfirmationService) {
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
    public GENDERS = GENDERS;
    public ROLES = ROLES;

    private getFormControls() {
        return {
            name: [{ value: `${this.user.firstName} ${this.user.lastName}`, disabled: true }],
            dateOfBirth: [{ value: this.Utils.FormatDate(this.user.birthDate), disabled: true }],
            role: [{ value: ROLES[this.user.role], disabled: true }],
            integrationId: [{ value: this.user.id, disabled: true }],
            staffPlanId: [{ value: this.user.personCode, disabled: true }],
            careSysId: [{ value: this.user.careSysGuid, disabled: true }],
            careSysUser: [{ value: this.user.careSysUsername, disabled: true }],
            cleverCogsId: [{ value: this.user.cleverCogsUserID, disabled: true }],
            cleverCogsEnabled: [{ value: (this.user.enableSync ? 'Yes' : 'No'), disabled: true }],
            dynamicsId: [{ value: 'N/A', disabled: true }],
            uhId: [{ value: 'N/A', disabled: true }],
            // Replace all this stuff with values that wouldn't be visible to applications normally
            firstName: [{ value: this.user.firstName, disabled: true }],
            middleName: [{ value: this.user.middleName, disabled: true }],
            lastName: [{ value: this.user.lastName, disabled: true }],
            gender: [{ value: GENDERS[this.user.gender], disabled: true }],
            address: [{ value: this.user.address, disabled: true }],
            postcode: [{ value: this.user.zippCode, disabled: true }],
            city: [{ value: this.user.city, disabled: true }]
        };
    }

    public enableMsg = () => this.user && this.user.enableSync ? 'Disable' : 'Enable';

    public mapUser(user: User) {
        this.cs.confirm({
            header: 'Confirm User Mapping',
            message: 'Are you sure you want to assign an Integration identity for this User?',
            accept: () => {
                this.ip.mapUser(user)
                    .catch(err => {
                        this.ms.add({
                            severity: 'error', summary: 'Error Mapping User',
                            detail: `Attempt to map ${user.firstName} ${user.lastName} failed. Please advise Business Solutions.`
                        });
                        return Observable.throw(err);
                    })
                    .subscribe(u => {
                        this.ms.add({
                            severity: 'success', summary: 'User Successfully Mapped',
                            detail: `User ${user.firstName} ${user.lastName} mapped with Integration Id ${u.id}`
                        });
                        this.user = u;
                        this.form = this.fb.group(this.getFormControls());
                    });
            }
        })
    }

    public toggleEnable(user: User) {
        this.cs.confirm({
            header: `${this.enableMsg()} User Integration`,
            message: `Are you sure you want to ${this.enableMsg()} ${this.user.firstName} ${this.user.lastName} for Integration`,
            accept: () => {
                this.ip.toggleEnable(user)
                    .catch(err => {
                        var verb = this.enableMsg().substring(0, this.enableMsg().length - 1);
                        this.ms.add({
                            severity: 'error', summary: `Error ${verb}ing User`,
                            detail: `An error ocurred while attempting to ${this.enableMsg()} Integration for ${user.firstName} ${user.lastName}. Please contact Business Solutions.`
                        });
                        return Observable.throw(err);
                    })
                    .subscribe(u => {
                        this.ms.add({
                            severity: 'success', summary: `User Successfully ${this.enableMsg()}d`,
                            detail: `User ${user.firstName} ${user.lastName} is now ${this.enableMsg()}d`
                        });
                        this.user = u;
                        this.form = this.fb.group(this.getFormControls());
                    });
            }
        });
    }
}
