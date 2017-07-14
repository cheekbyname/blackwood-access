import { Component, OnInit } from "@angular/core";

import { AccessUser } from "../../models/accessuser";
import { Team } from "../../models/team";

import { PayrollProvider } from "../../payroll/payroll.provider";
import { UserProvider } from '../../user.provider';

@Component({
    selector: 'user-admin',
    template: require('./user.admin.component.html'),
    styles: [require('./user.admin.component.css')]
})
export class UserAdminComponent implements OnInit {

    allUsers: AccessUser[];
    allTeams: Team[];

    constructor(private userPro: UserProvider, private payPro: PayrollProvider) { }

    ngOnInit() {
        this.payPro.teams$.subscribe(teams => this.allTeams = teams);
        this.userPro.allUsers$.subscribe(users => this.allUsers = users);
        //this.payPro.getTeams();
        this.userPro.GetAllUsers();
    }
}