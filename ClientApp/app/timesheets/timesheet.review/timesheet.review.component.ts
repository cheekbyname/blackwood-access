import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

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
					}
				});
			}
		});

        this.timePro.carers$.subscribe((carers) => this.carers = carers);
        this.timePro.adjustments$.subscribe(adjustments => this.adjustments = adjustments);
        this.timePro.periodStart$.subscribe(periodStart => this.periodStart = periodStart);
        this.timePro.periodFinish$.subscribe(periodFinish => this.periodFinish = periodFinish);
        // GetAdjustmentsByTeam
    }

    public clearDetail() {
		this.router.navigate([{ outlets: { 'detail': null }}]);
	}
}