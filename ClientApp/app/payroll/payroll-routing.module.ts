import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PayrollGuard } from "./payroll-guard.service";

import { PayrollComponent } from "./payroll.component";
import { PayrollExportComponent } from "./payroll.export/payroll.export.component";
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollReviewComponent } from "./payroll.review/payroll.review.component";
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

const timesheetRoutes: Routes = [
	{ path: 'payroll/:teamCode', component: PayrollComponent, canActivate: [PayrollGuard], children: [
		{ path: '', component: PayrollManagerComponent },
		{ path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
		{ path: 'timesheet/:carer/:week', component: TimesheetViewerComponent, outlet: 'detail'},
		{ path: 'timesheet/:carer', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
		{ path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
		{ path: 'export/:teamCode', component: PayrollExportComponent, outlet: 'detail'}
	] },
	{ path: 'payroll', component: PayrollComponent, canActivate: [PayrollGuard], children: [
		{ path: '', component: PayrollManagerComponent }
	]}
];

@NgModule({
    imports: [ RouterModule.forChild(timesheetRoutes) ],
    exports: [ RouterModule ]
})
export class PayrollRoutingModule { }
