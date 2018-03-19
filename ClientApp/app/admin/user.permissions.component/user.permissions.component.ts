import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { AccessUser } from "../../models/AccessUser";
import { Team } from "../../models/payroll/Team";

import { PayrollProvider } from "../../payroll/payroll.provider";
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'user-permissions',
    templateUrl: 'user.permissions.component.html',
    styleUrls: ['user.permissions.component.css']
})
export class UserPermissionsComponent implements OnInit {
    currentUser: AccessUser;
    selectedUser: AccessUser;
    prevUser: AccessUser;
    allUsers: AccessUser[];
    allTeams: Team[];

    constructor(private userPro: UserProvider, private router: Router, private route: ActivatedRoute, payPro: PayrollProvider) {
        userPro.GetAllUsers();
        payPro.getTeams();

        payPro.teams$.subscribe(tm => this.allTeams = tm);
        userPro.userInfo$.subscribe(us => this.currentUser = us);
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["user"] !== undefined) {
                this.userPro.allUsers$.subscribe(us => {
                    this.allUsers = us;
                    this.selectedUser = us.find(u => u.id == p["user"]);
                    this.prevUser = this.selectedUser;
                });
            }
        });
    }

    isDirty(form: NgForm): boolean {
        return form.dirty;
    }

    undoChanges(form: NgForm) {
        // Reload Users from API
        this.userPro.GetAllUsers();
    }

    saveChanges(form: NgForm) {
        if (JSON.stringify(this.selectedUser) !== JSON.stringify(this.prevUser)) {
            this.userPro.PutUser(this.selectedUser);
        }
    }
}