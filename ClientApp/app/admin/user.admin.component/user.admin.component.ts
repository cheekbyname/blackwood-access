import { Component, OnInit } from "@angular/core";

import { AccessUser } from "../../models/accessuser";
import { UserProvider } from '../../user.provider';

@Component({
    selector: 'user-admin',
    template: require('./user.admin.component.html'),
    styles: [require('./user.admin.component.css')]
})
export class UserAdminComponent implements OnInit {

    allUsers: AccessUser[];

    constructor(private userPro: UserProvider) { }

    ngOnInit() {
        this.userPro.allUsers$.subscribe(users => this.allUsers = users);
        this.userPro.GetAllUsers();
    }
}