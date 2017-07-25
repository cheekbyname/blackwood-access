import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Rx";

import { Adjustment } from "../../models/adjustment";
import { Carer } from "../../models/carer";
import { Team } from "../../models/team";
import { Timesheet } from "../../models/timesheet";
import { PayrollProvider } from "../payroll.provider";
import { TimesheetAdjustmentComponent } from "../timesheet.adjustment/timesheet.adjustment.component";

@Component({
    selector: 'payroll-review',
    template: require('./payroll.review.component.html'),
    styles: [require('./payroll.review.component.css')]
})
export class PayrollReviewComponent implements OnInit {

    public adjustments: Adjustment[];
    public carers: Carer[];
    public revisions: { carer: Carer, reason: string }[] = [];
    public team: Team;

    // To support timesheet-adjustment component
    public timesheet: Timesheet;
    public adjustVisible: boolean = false;
    public dayOffset: number;
    public weekCommencing: Date;

    constructor(private payPro: PayrollProvider, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        // Sub to provider data
        this.payPro.carers$.subscribe(carers => {
            this.carers = carers;
            if (carers !== null) {
                this.checkValid(this.carers);
            }
        });
        this.payPro.adjustments$.subscribe(adjusts => this.adjustments = adjusts);
        this.payPro.timesheet$.subscribe(ts => this.timesheet = ts);
        this.payPro.weekCommencing$.subscribe(wc => this.weekCommencing = wc);
        this.payPro.selectedTeam$.subscribe(tm => this.team = tm);
    }

    checkValid(carers: Carer[]) {
        // TODO Refactor to general-purpose validatino method on controller, as sensible to keep this in sync
        // TODO with whatever validation is done at the final output stage
        this.revisions = [];
        carers.filter(ca => ca.personnelNumber == '' || ca.personnelNumber == null).forEach(car => {
            this.pushRevision(car, 'Missing Payroll Number');
        });
        carers.filter(ca => ca.careSysGuid === null).forEach(car => {
            this.pushRevision(car, 'No CareSys mapping for Default Team');
        });
        // TODO Check there is a contract on StaffPlan for the primary location on CareSys
        //carers.filter(ca => )
    }

    pushRevision(carer: Carer, rev: string) {
        var pos = this.revisions.map(rev => {return rev.carer}).indexOf(carer);
        if (pos == -1) {
            this.revisions.push({carer: carer, reason: rev});
        } else {
            this.revisions[pos].reason += (', ' + rev);
        }
    }

    carerForAdjust(adjust: Adjustment): Carer {
        return this.carers.find(car => car.carerCode == adjust.carerCode);
    }

    public clearDetail() {
        this.router.navigate(['/payroll', this.team.teamCode,
			{ outlets: { detail: null, summary: ['summary', this.team.teamCode] }}]);
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
            var idx = this.adjustments.findIndex(adj => adj.guid == adjust.guid);
            // Push any newly added adjustment
            if (idx == -1) this.adjustments.push(adjust);
            this.adjustments[idx] = adjust;
        });
        // Check back the other way for any removed adjustments
        this.adjustments.filter(adj => adj.weekCommencing == ts.weekCommencing && adj.carerCode == ts.carerCode)
            .forEach(adjust => {
                var idx = ts.adjustments.findIndex(adj => adj.guid == adjust.guid);
                if (idx == -1) this.adjustments.splice(this.adjustments.indexOf(adjust), 1);
        });
    }

    public authInfo(adjust: Adjustment): string {
        return (adjust.authorisedBy || adjust.rejectedBy) ? `${adjust.authorisedBy || adjust.rejectedBy} ${this.payPro.displayDate(adjust.authorised || adjust.rejected)}`
            : 'Pending';
    }
}