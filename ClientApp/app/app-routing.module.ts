import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
// import { PayrollManagerComponent } from './payroll/payroll.manager/payroll.manager.component';
// import { TimesheetViewerComponent } from './payroll/timesheet.viewer/timesheet.viewer.component';
// import { PayrollSummaryComponent } from './payroll/payroll.summary/payroll.summary.component';
// import { PayrollReviewComponent } from "./payroll/payroll.review/payroll.review.component";
import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

const APPROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	// { path: 'payroll-manager', component: PayrollManagerComponent },
	// { path: 'payroll-manager/:teamCode', component: PayrollManagerComponent },
	// { path: 'summary', component: PayrollSummaryComponent, outlet: 'summary'},
	// { path: 'summary/:teamCode', component: PayrollSummaryComponent, outlet: 'summary'},
	// { path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
	// { path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
	// { path: 'review/:teamCode', component: PayrollReviewComponent, outlet: 'detail'},
	{ path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
	{ path: '**', redirectTo: 'home' }
];

@NgModule({
	imports: [ RouterModule.forRoot(APPROUTES) ],	// , {enableTracing: true}
	exports: [ RouterModule ]
})
export class AppRouterModule {}
