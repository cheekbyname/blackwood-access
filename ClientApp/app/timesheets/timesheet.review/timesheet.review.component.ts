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

    // To support timesheet-adjustment component
    public timesheet: Timesheet;
    public adjustVisible: boolean = false;
    public dayOffset: number;
    public weekCommencing: Date;

    constructor(private timePro: TimesheetProvider, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        // Sub to provider data
        this.timePro.carers$.subscribe(carers => this.carers = carers);
        this.timePro.adjustments$.subscribe(adjusts => this.adjustments = adjusts);
        this.timePro.timesheet$.subscribe(ts => this.timesheet = ts);
        this.timePro.weekCommencing$.subscribe(wc => this.weekCommencing = wc);
    }

    carerForAdjust(adjust: Adjustment): Carer {
        return this.carers.find(car => car.carerCode == adjust.carerCode);
    }

    public clearDetail() {
		this.router.navigate([{ outlets: { 'detail': null }}]);
	}

    public addDays(dt: Date, offset: number): Date {
        var res = new Date(dt);
        res.setDate(res.getDate() + offset);
        return res;
    }

    showAdjust(adjust: Adjustment) {
        this.timePro.selectCarer(this.carerForAdjust(adjust));
        this.timePro.selectWeekCommencing(new Date(adjust.weekCommencing));     // TODO Not a date? Why not?
        this.dayOffset = adjust.dayOffset;
        this.adjustVisible = true;
    }

    handleChanges(ts: Timesheet) {
        ts.adjustments.forEach(adjust => {
            var idx = this.adjustments.findIndex(adj => adj.guid == adjust.guid);
            this.adjustments[idx] = adjust;
        });
    }
}