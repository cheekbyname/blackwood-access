import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { TimesheetManagerComponent } from './components/timesheetmanager/timesheetmanager.component';
import { InitialAssessManagerComponent } from './components/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './components/initialassess/initialassess.component';

import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';

const APPROUTES: Routes = [
	{ path: '', redirectTo: 'timesheet-manager', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'timesheet-manager', component: TimesheetManagerComponent },
	{ path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
	{ path: 'counter', component: CounterComponent },
	{ path: 'fetch-data', component: FetchDataComponent },
	{ path: '**', redirectTo: 'home' }
];

@NgModule({
	imports: [ RouterModule.forRoot(APPROUTES) ],
	exports: [ RouterModule ]
})
export class AppRouterModule { }
