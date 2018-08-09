import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";

import { AccessUser } from "../../models/AccessUser";

import { UserProvider } from "../../user.provider";

@Component({
    selector: 'user-chooser',
    templateUrl: 'user.chooser.component.html',
    styleUrls: ['user.chooser.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserChooserComponent {
    constructor (private up: UserProvider) {
        this.up.GetAllUsers();
        this.up.allUsers$.subscribe(au => this.users = au);
    }

    selectedUser: AccessUser;
    users: AccessUser[];

    @Input()
    chooserVisible: boolean = false;
    @Output('userChosen')
    public onUserChosen: EventEmitter<AccessUser> = new EventEmitter<AccessUser>();

    dismiss() {
        this.onUserChosen.emit(undefined);
    }

    selectUser() {
        this.onUserChosen.emit(this.selectedUser);
    }
}