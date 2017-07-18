import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PayrollComponent } from "./payroll.component";
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollReviewComponent } from "./payroll.review/payroll.review.component";
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

const TIMESHEETROUTES: Routes = [
	{ path: 'payroll-manager', component: PayrollComponent, children: [
		{ path: '', component: PayrollManagerComponent },
		{ path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
	] },
	{ path: 'payroll-manager/:teamCode', component: PayrollComponent, children: [
		{ path: '', component: PayrollManagerComponent },
		{ path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
	] },
];

@NgModule({
    imports: [ RouterModule.forChild(TIMESHEETROUTES) ],
    exports: [ RouterModule ]
})
export class PayrollRoutingModule { }
