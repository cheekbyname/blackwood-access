import { Component, OnInit, Output } from "@angular/core";
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
    selectedUser: AccessUser;
    prevUser: AccessUser;
    allUsers: AccessUser[];
    allTeams: Team[];
    authTeams: Team[];

    constructor(private userPro: UserProvider, private router: Router, private route: ActivatedRoute, payPro: PayrollProvider) {
        userPro.GetAllUsers();
        payPro.getTeams();

        payPro.teams$.subscribe(tm => this.allTeams = tm);
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["user"] !== undefined) {
                this.userPro.allUsers$.subscribe(us => {
                    this.allUsers = us;
                    this.selectedUser = us.find(u => u.id == p["user"]);
                    this.prevUser = Object.assign({}, this.selectedUser);
                    this.updateAuthTeams();
                });
            }
        });
    }

    isDirty(form: NgForm): boolean {
        return form.dirty;
    }

    updateAuthTeams() {
        this.selectedUser.authorizedTeams.forEach(at => {
            at.team = this.allTeams.find(all => all.teamCode == at.teamCode);
        });
        this.selectedUser.authorizedTeams = this.selectedUser.authorizedTeams
            .sort((a, b) => { return ( a.team.teamDesc < b.team.teamDesc ? 0 : 1)});
        this.authTeams = this.selectedUser.authorizedTeams.map(at => at.team);
        if (!this.selectedUser.authorizedTeams.map(at => at.teamCode).some(tc => tc == this.selectedUser.defaultTeamCode)) {
            this.selectedUser.defaultTeamCode = 0;
        }
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