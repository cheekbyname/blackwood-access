import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { TimesheetManagerComponent } from './timesheets/timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './timesheets/timesheetviewer/timesheetviewer.component';
import { TeamTimeSummaryComponent } from './timesheets/teamtimesummary/teamtimesummary.component';
import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

const APPROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'timesheet-manager', component: TimesheetManagerComponent },
	{ path: 'timesheet-manager/:teamCode', component: TimesheetManagerComponent },
	{ path: 'summary', component: TeamTimeSummaryComponent, outlet: 'summary'},
	{ path: 'summary/:teamCode', component: TeamTimeSummaryComponent, outlet: 'summary'},
	{ path: 'timesheet', component: TimesheetViewerComponent, outlet: 'detail' },
	{ path: 'timesheet/:carerCode', component: TimesheetViewerComponent, outlet: 'detail' },
	{ path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
	{ path: '**', redirectTo: 'home(summary:null//detail:null)' }
];

@NgModule({
	imports: [ RouterModule.forRoot(APPROUTES, {enableTracing: true}) ],
	exports: [ RouterModule ]
})
export class AppRouterModule {}
