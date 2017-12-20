import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import { Observable } from "rxjs/Rx";

import { Team } from '../../models/Team';
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

    constructor(public payPro: PayrollProvider, private router: Router, private route: ActivatedRoute, private userPro: UserProvider) {

    }

    ngOnInit() {
        Observable
            .combineLatest(this.userPro.userInfo$, this.payPro.teams$, (u, t) => {
                return { "user": u, "teams": t };
            })
            .subscribe(x => {
                if (x.teams !== undefined && x.teams !== null && x.user !== undefined) {
                    this.teams = x.teams;
                    this.user = x.user;
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
        this.payPro.getTeams();
        // Init Team list in TimesheetService TODO Check why this is necessary
        //this.payPro.getTeams();

        // this.userPro.userInfo$.subscribe(u => this.user = u);

        // this.payPro.teams$.subscribe(teams => {
        //     if (teams != null) {
        //         this.teams = teams;
        //         this.route.params.subscribe(params => {
        //             if (params['teamCode'] != undefined ) {
        //                 this.selectedTeam = teams.find(team => team.teamCode == params['teamCode']);
        //             } else
        //             if (this.user != undefined) {
        //                 this.selectedTeam = teams.find(team => team.teamCode == this.user.defaultTeamCode);
        //             }
        //         });
        //     }
        // })
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