import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Rx";

import { Adjustment } from "../../models/adjustment";
import { Carer } from "../../models/carer";
import { Team } from "../../models/team";
import { Timesheet } from "../../models/timesheet";
import { PayrollProvider } from "../payroll.provider";
import { TimesheetAdjustmentComponent } from "../timesheet.adjustment/timesheet.adjustment.component";
import { ValidationResult } from "../../models/validation";

@Component({
    selector: 'payroll-review',
    template: require('./payroll.review.component.html'),
    styles: [require('./payroll.review.component.css')]
})
export class PayrollReviewComponent implements OnInit {

    public valid: ValidationResult;

    // To support timesheet-adjustment component
    public timesheet: Timesheet;
    public adjustVisible: boolean = false;
    public dayOffset: number;
    public weekCommencing: Date;

    constructor(private payPro: PayrollProvider, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        // Sub to provider data
        this.payPro.validation$.subscribe(valid => this.valid = valid);

        this.payPro.timesheet$.subscribe(ts => this.timesheet = ts);
        this.payPro.weekCommencing$.subscribe(wc => this.weekCommencing = wc);
    }

    carerForAdjust(adjust: Adjustment): Carer {
        return this.valid.carers.find(car => car.carerCode == adjust.carerCode);
    }

    public clearDetail() {
        this.router.navigate(['/payroll', this.valid.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.valid.teamCode] }}]);
	}

    public addDays(dt: Date, offset: number): Date {
        var res = new Date(dt);
        res.setDate(res.getDate() + offset);
        return res;
    }

    showAdjust(adjust: Adjustment) {
        this.payPro.selectCarer(this.carerForAdjust(adjust));
        this.payPro.selectWeekCommencing(new Date(adjust.weekCommencing));     // TODO Not a date? Why not?
        this.dayOffset = adjust.dayOffset;
        this.adjustVisible = true;
    }

    handleChanges(ts: Timesheet) {
        ts.adjustments.forEach(adjust => {
            var idx = this.valid.pendingAdjustments.findIndex(adj => adj.guid == adjust.guid);
            // Push any newly added adjustment
            if (idx == -1) this.valid.pendingAdjustments.push(adjust);
            this.valid.pendingAdjustments[idx] = adjust;
        });
        // Check back the other way for any removed adjustments
        this.valid.pendingAdjustments.filter(adj => adj.weekCommencing == ts.weekCommencing && adj.carerCode == ts.carerCode)
            .forEach(adjust => {
                var idx = ts.adjustments.findIndex(adj => adj.guid == adjust.guid);
                if (idx == -1) this.valid.pendingAdjustments.splice(this.valid.pendingAdjustments.indexOf(adjust), 1);
        });
    }

    public authInfo(adjust: Adjustment): string {
        return (adjust.authorisedBy || adjust.rejectedBy)
            ? `${adjust.authorisedBy || adjust.rejectedBy} ${this.payPro.displayDate(adjust.authorised || adjust.rejected)}`
            : 'Pending';
    }
}