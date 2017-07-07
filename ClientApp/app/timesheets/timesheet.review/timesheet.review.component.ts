import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Rx";

import { Adjustment } from "../../models/adjustment";
import { Carer } from "../../models/carer";
import { Team } from "../../models/team";
import { Timesheet } from "../../models/timesheet";
import { TimesheetProvider } from "../timesheet.provider";
import { TimesheetAdjustmentComponent } from "../timesheet.adjustment/timesheet.adjustment.component";

@Component({
    selector: 'timesheet-review',
    template: require('./timesheet.review.component.html'),
    styles: [require('./timesheet.review.component.css')]
})
export class TimesheetReviewComponent implements OnInit {

    public adjustments: Adjustment[];
    public carers: Carer[];
    public team: Team;
    public periodStart: Date;
    public periodFinish: Date;

    // To support timesheet-adjustment component
    public timesheet: Timesheet;
    public adjustVisible: boolean = false;
    public dayOffset: number;
    public weekCommencing: Date;

    constructor(private timePro: TimesheetProvider, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe((p) => {
			if (p['teamCode'] != undefined) {
				this.timePro.teams$.subscribe((teams) => {
					if (teams != null) {
						var team = teams.find(t => t.teamCode == p['teamCode']);
						this.team = team;
						this.timePro.selectTeam(team);	// TODO Works, but shouldn't it be on ManagerComponent?
                        //this.timePro.getAdjustmentsByTeam(team, this.periodStart, this.periodFinish);
					}
				});
                this.timePro.adjustments$.subscribe(adjusts => {
                    if (adjusts != null) {
                        this.adjustments = adjusts;
                    }
                });
			}
		});

        this.timePro.carers$.subscribe((carers) => this.carers = carers);
        this.timePro.periodStart$.subscribe(periodStart => this.periodStart = periodStart);
        this.timePro.periodFinish$.subscribe(periodFinish => this.periodFinish = periodFinish);

        // GetAdjustmentsByTeam
        Observable.zip(this.timePro.selectedTeam$, this.timePro.periodStart$, this.timePro.periodFinish$, 
            (team, start, finish) => { return {"team": team, "start": start, "finish": finish} })
            .subscribe(x => {
                if (x.start != null && x.finish != null)
                    this.timePro.getTimesheetAdjustmentsByTeam(x.team, x.start, x.finish);
            });
    }

    carerForAdjust(adjust: Adjustment): string {
        var carer = this.carers.find(car => car.carerCode == adjust.carerCode);
        if (carer == undefined) {
            console.log('Break');
        }
        return `${carer.forename} ${carer.surname}`;
    }

    public clearDetail() {
		this.router.navigate([{ outlets: { 'detail': null }}]);
	}
}