import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PayrollComponent } from "./payroll.component";
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollReviewComponent } from "./payroll.review/payroll.review.component";
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

const timesheetRoutes: Routes = [
	{ path: 'payroll', component: PayrollComponent, children: [
		{ path: '', component: PayrollManagerComponent },
		{ path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
	] },
	{ path: 'payroll/:teamCode', component: PayrollComponent, children: [
		{ path: '', component: PayrollManagerComponent },
		{ path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
	] },
];

@NgModule({
    imports: [ RouterModule.forChild(timesheetRoutes) ],
    exports: [ RouterModule ]
})
export class PayrollRoutingModule { }
