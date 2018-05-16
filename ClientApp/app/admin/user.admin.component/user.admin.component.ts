import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { AccessUser } from "../../models/AccessUser";
import { Team } from "../../models/payroll/Team";

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

    constructor(private userPro: UserProvider, private payPro: PayrollProvider, private router: Router) { }

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
        form.reset();
    }

    saveChanges(form: NgForm) {
        this.allUsers.forEach(u => {
            var p = this.prevUsers.find(p => p.id === u.id);
            if (JSON.stringify(p) !== JSON.stringify(u)) {
                this.userPro.PutUser(u);
            }
        });
    }

    selectUser(user: AccessUser) {
        this.router.navigate(['admin/users', user.id]);
    }

    addUser() {

    }
}