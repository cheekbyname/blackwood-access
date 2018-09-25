import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { AccessUser } from "../../models/AccessUser";
import { AccessUserTeam } from "../../models/AccessUserTeam";
import { Team } from "../../models/payroll/Team";

import { PayrollProvider } from "../../payroll/payroll.provider";
import { UserProvider } from "../../user.provider";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'user-permissions',
    templateUrl: 'user.permissions.component.html',
    styleUrls: ['user.permissions.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserPermissionsComponent implements OnInit {
    selectedUser: AccessUser;
    prevUser: string;
    allUsers: AccessUser[];
    allTeams: Team[];
    authTeams: Team[];

    form: FormGroup;

    constructor(private up: UserProvider, pp: PayrollProvider, private router: Router, private route: ActivatedRoute,
        public fb: FormBuilder) {
        up.GetAllUsers();

        pp.teams$.subscribe(tm => this.allTeams = tm);
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            if (p["user"] !== undefined) {
                this.up.allUsers$.subscribe(us => {
                    this.allUsers = us;
                    if (p["user"] == 0) {
                        this.selectedUser = new AccessUser();
                    } else {
                        this.selectedUser = us.find(u => u.id == p["user"]);
                    }
                    this.prevUser = JSON.stringify(this.selectedUser);
                    this.updateAuthTeams();

                    // Setup Form
                    this.form = this.fb.group(this.getFormControls());
                    this.form.addControl("authTeams", this.fb.array([]));
                    var teamsArray = this.form.get('authTeams') as FormArray;
                    this.selectedUser.authorizedTeams.forEach(at => {
                        teamsArray.push(this.fb.group(AccessUserTeam.Controls(at)));
                    });

                });
            }
        });
    }

    getFormControls() {
        return {
            id: [this.selectedUser.id],
            accountName: [this.selectedUser.accountName, Validators.required],
            domainUsername: [this.selectedUser.domainUsername],
            emailAddress: [this.selectedUser.emailAddress],
            isActive: [this.selectedUser.isActive],
            isPayrollUser: [this.selectedUser.isPayrollUser],
            isAssessmentUser: [this.selectedUser.isAssessmentUser],
            isAdmin: [this.selectedUser.isAdmin],
            isAccidentUser: [this.selectedUser.isAccidentUser],
            isReportingUser: [this.selectedUser.isReportingUser],
            defaultTeamCode: [this.selectedUser.defaultTeamCode],
            canAuthoriseAdjustments: [this.selectedUser.canAuthoriseAdjustments],
            canRejectAdjustments: [this.selectedUser.canRejectAdjustments]
        }
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
        // TODO Tweak for FormArray
        var newTeam = new AccessUserTeam(this.selectedUser.id);
        this.selectedUser.authorizedTeams.push(newTeam);
        this.updateAuthTeams();
    }

    removeTeam(auth: AccessUserTeam) {
        // TODO Tweak for FormArray
        var teamAt = this.selectedUser.authorizedTeams.indexOf(auth);
        this.selectedUser.authorizedTeams.splice(teamAt, 1);
        this.updateAuthTeams();
    }

    undoChanges(form: NgForm) {
        // Reload Users from API
        this.up.GetAllUsers();
    }

    saveChanges(form: NgForm) {
        // TODO Remove any Authorised Teams added but not selected
        if (JSON.stringify(this.selectedUser) !== this.prevUser) {
            this.up.PutUser(this.selectedUser)
                .catch(err => {
                    return Observable.throw(err);
                }).subscribe(r => {
                    this.selectedUser = r;
                });
        }
    }
}