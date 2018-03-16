import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Rx";

import { Adjustment } from "../../models/payroll/Adjustment";
import { Carer } from "../../models/payroll/Carer";
import { Shift } from "../../models/payroll/Shift";
import { Team } from "../../models/payroll/Team";
import { Timesheet } from "../../models/payroll/Timesheet";
import { ValidationResult } from "../../models/payroll/Validation";

import { PayrollProvider } from "../payroll.provider";
import { TimesheetAdjustmentComponent } from "../timesheet.adjustment/timesheet.adjustment.component";

@Component({
    selector: 'payroll-review',
    templateUrl: './payroll.review.component.html',
    styleUrls: ['./payroll.review.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PayrollReviewComponent implements OnInit {

    public valid: ValidationResult;
    public showAdjustmentsHandled: boolean = false;
    public showAdjustmentsPending: boolean = false;
    public showInvalidShifts: boolean = false;
    public showDataRevisions: boolean = false;

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

    carerForShift(shift: Shift): Carer {
        return this.valid.carers.find(car => car.carerCode == shift.carerCode);
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

    timesheetFor(shift: Shift) {
        this.payPro.selectWeekCommencing(new Date(shift.start));
        this.router.navigate(['/payroll', this.valid.teamCode,
            { outlets: {
                detail: ['timesheet', shift.carerCode],
                summary: ['summary', this.valid.teamCode]
            }
        }]);
    }

    handleChanges(ts: Timesheet) {
        ts.adjustments.forEach(adjust => {
            // Tuple expressing previous state
            let prev: [number, number, number] = [0,
                this.valid.pendingAdjustments.findIndex(adj => adj.guid == adjust.guid),
                this.valid.otherAdjustments.findIndex(adj => adj.guid == adjust.guid),
            ];
            prev[0] += (prev[1] >= 0 ? 1: 0) + (prev[2] >= 0 ? 2: 0);
            var newArr = this.validArrayFor(adjust);

            switch(prev[0]) {
                // Push any newly added adjustment
                case 0: 
                    newArr.push(adjust);
                    break;
                // Was pending
                case 1:
                    if (newArr !== this.valid.pendingAdjustments) {
                        this.valid.pendingAdjustments.splice(prev[1], 1);
                        newArr.push(adjust);
                    } else {
                        newArr[prev[1]] = adjust;
                    }
                    break;
                // Was other
                case 2:
                    if (newArr !== this.valid.otherAdjustments) {
                        this.valid.otherAdjustments.splice(prev[2], 1);
                        newArr.push(adjust);
                    } else {
                        newArr[prev[2]] = adjust;
                    }
                    break;
            }

        });

        // TODO This needs refactoring
        // Check back the other way for any removed adjustments
        this.valid.pendingAdjustments.filter(adj => adj.weekCommencing == ts.weekCommencing && adj.carerCode == ts.carerCode)
            .forEach(adjust => {
                var idx = ts.adjustments.findIndex(adj => adj.guid == adjust.guid);
                if (idx == -1) this.valid.pendingAdjustments.splice(this.valid.pendingAdjustments.indexOf(adjust), 1);
        });
    }

    validArrayFor(adjust: Adjustment): Adjustment[] {
        return adjust.authorised === null && adjust.rejected === null ? this.valid.pendingAdjustments : this.valid.otherAdjustments;
    }

    public authInfo(adjust: Adjustment): string {
        return (adjust.authorisedBy || adjust.rejectedBy)
            ? `${adjust.authorisedBy || adjust.rejectedBy} ${this.payPro.displayDate(adjust.authorised || adjust.rejected)}`
            : 'Pending';
    }
}