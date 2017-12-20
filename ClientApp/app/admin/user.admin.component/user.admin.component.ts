import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AccessUser } from "../../models/AccessUser";
import { Team } from "../../models/Team";

import { PayrollProvider } from "../../payroll/payroll.provider";
import { UserProvider } from '../../user.provider';

@Component({
    selector: 'user-admin',
    templateUrl: './user.admin.component.html',
    styleUrls: ['./user.admin.component.css']
})
export class UserAdminComponent implements OnInit {

    allUsers: AccessUser[];
    prevUsers: AccessUser[];
    allTeams: Team[];

    constructor(private userPro: UserProvider, private payPro: PayrollProvider) { }

    ngOnInit() {
        this.payPro.teams$.subscribe(teams => this.allTeams = teams);
        this.userPro.allUsers$.subscribe(users => {
            this.allUsers = users;
            this.prevUsers = this.allUsers.map(x => Object.assign({}, x));
        });
        this.userPro.GetAllUsers();
    }

    isDirty(form: NgForm): boolean {
        return form.dirty;
    }

    undoChanges(form: NgForm) {
        // Reload Users from API
        this.userPro.GetAllUsers();
    }

    saveChanges(form: NgForm) {
        this.allUsers.forEach(u => {
            var p = this.prevUsers.find(p => p.id === u.id);
            if (JSON.stringify(p) !== JSON.stringify(u)) {
                this.userPro.PutUser(u);
            }
        });
    }
}