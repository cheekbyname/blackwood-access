import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { TimesheetManagerComponent } from './timesheets/timesheetmanager/timesheetmanager.component';
import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

const APPROUTES: Routes = [
	{ path: '', redirectTo: 'timesheet-manager', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'timesheet-manager', component: TimesheetManagerComponent },
	{ path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
	{ path: '**', redirectTo: 'home' }
];

@NgModule({
	imports: [ RouterModule.forRoot(APPROUTES) ],
	exports: [ RouterModule ]
})
export class AppRouterModule { }
