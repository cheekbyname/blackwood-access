import { Component, OnInit, Output } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { AccessUser } from "../../models/AccessUser";
import { AccessUserTeam } from "../../models/AccessUserTeam";
import { Team } from "../../models/payroll/Team";

import { PayrollProvider } from "../../payroll/payroll.provider";
import { UserProvider } from "../../user.provider";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'user-permissions',
    templateUrl: 'user.permissions.component.html',
    styleUrls: ['user.permissions.component.css']
})
export class UserPermissionsComponent implements OnInit {
    selectedUser: AccessUser;
    prevUser: string;
    allUsers: AccessUser[];
    allTeams: Team[];
    authTeams: Team[];

    constructor(private userPro: UserProvider, private router: Router, private route: ActivatedRoute, payPro: PayrollProvider) {
        userPro.GetAllUsers();

        payPro.teams$.subscribe(tm => this.allTeams = tm);
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["user"] !== undefined) {
                this.userPro.allUsers$.subscribe(us => {
                    this.allUsers = us;
                    if (p["user"] == 0) {
                        this.selectedUser = new AccessUser();
                    } else {
                        this.selectedUser = us.find(u => u.id == p["user"]);
                    }
                    this.prevUser = JSON.stringify(this.selectedUser);
                    this.updateAuthTeams();
                });
            }
        });
    }

    codeOfTeam(index, item) {
        return item.teamCode;
    }

    isDirty(form: NgForm): boolean {
        return form.dirty;
    }

    accountNameChanged() {
        this.selectedUser.domainUsername = `M_BLACKWOOD\\${this.selectedUser.accountName}`;
        this.selectedUser.emailAddress = `${this.selectedUser.accountName}@blackwoodgroup.org.uk`;
    }

    updateAuthTeams() {
        this.selectedUser.authorizedTeams.forEach(at => {
            at.team = this.allTeams.find(all => all.teamCode == at.teamCode) || new Team();
        });
        this.selectedUser.authorizedTeams = this.selectedUser.authorizedTeams
            .sort((a, b) => { return (a.team.teamDesc < b.team.teamDesc ? 0 : 1) });
        this.authTeams = this.selectedUser.authorizedTeams.filter(at => at.teamCode !== 0)
            .map(at => this.allTeams.find(aa => aa.teamCode == at.teamCode));
        if (!this.selectedUser.authorizedTeams.map(at => at.teamCode).some(tc => tc == this.selectedUser.defaultTeamCode)) {
            this.selectedUser.defaultTeamCode = 0;
        }
    }

    authable(auth: AccessUserTeam): Team[] {
        var authable = this.authTeams.filter(at => at.teamCode !== auth.teamCode).map(at => at.teamCode);
        return this.allTeams.filter(at => !authable.some(au => au == at.teamCode));
    }

    addTeam() {
        var newTeam = new AccessUserTeam(this.selectedUser.id);
        this.selectedUser.authorizedTeams.push(newTeam);
        this.updateAuthTeams();
    }

    removeTeam(auth: AccessUserTeam) {
        var teamAt = this.selectedUser.authorizedTeams.indexOf(auth);
        this.selectedUser.authorizedTeams.splice(teamAt, 1);
        this.updateAuthTeams();
    }

    undoChanges(form: NgForm) {
        // Reload Users from API
        this.userPro.GetAllUsers();
    }

    saveChanges(form: NgForm) {
        // TODO Remove any Authorised Teams added but not selected
        if (JSON.stringify(this.selectedUser) !== this.prevUser) {
            this.userPro.PutUser(this.selectedUser)
                .catch(err => {
                    return Observable.throw(err);
                }).subscribe(r => {
                    this.selectedUser = r;
                });
        }
    }
}