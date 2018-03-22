import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import { Observable } from "rxjs/Rx";

import { Team } from '../../models/payroll/Team';
import { AccessUser } from "../../models/AccessUser";

import { PayrollProvider } from '../payroll.provider';
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'payroll-manager',
    templateUrl: './payroll.manager.component.html',
    styleUrls: ['./payroll.manager.component.css']
})
export class PayrollManagerComponent implements OnInit {

    public teams: Team[];
    public user: AccessUser;
    
    _selectedTeam: Team;

    constructor(public payPro: PayrollProvider, private router: Router, private route: ActivatedRoute,
        private userPro: UserProvider) { }

    ngOnInit() {
        Observable
            .combineLatest(this.userPro.userInfo$, this.payPro.teams$, (u, t) => {
                return { "user": u, "teams": t };
            })
            .subscribe(x => {
                if (x.teams !== undefined && x.teams !== null && x.user !== undefined) {
                    this.user = x.user;
                    var visibleTeams = x.user.authorizedTeams.filter(t => t.canView).map(t => t.teamCode);
                    this.teams = x.teams.filter(t => visibleTeams.some(v => v === t.teamCode));
                    this.route.params.subscribe(p => {
                        if (p['teamCode'] !== undefined) {
                            this.setTeam(p['teamCode']);
                        } else
                        if (this.user.defaultTeamCode !== null) {
                            this.setTeam(x.user.defaultTeamCode);
                        }
                    })
                }
            });

        this.userPro.GetUserInfo();
    }

    setTeam(teamCode: number): void {
        this.selectedTeam = this.teams.find(team => team.teamCode == teamCode);
    }

    get selectedTeam() { return this._selectedTeam }
    set selectedTeam(team: Team ) {
        this._selectedTeam = team;
        this.payPro.selectTeam(team);

        // Navigate to aux route for summary
        this.router.navigate([{ outlets: { 'detail': null }}]).then((q) => {
            this.router.navigate(['payroll', this.selectedTeam.teamCode,
                { outlets: { 'summary': ['summary', this.selectedTeam.teamCode] }}]);
        });
    }
}