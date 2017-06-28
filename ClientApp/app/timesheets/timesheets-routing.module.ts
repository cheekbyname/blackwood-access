import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetManagerComponent } from './timesheetmanager/timesheetmanager.component';
import { TeamTimeSummaryComponent } from './teamtimesummary/teamtimesummary.component';
import { TimesheetViewerComponent } from './timesheetviewer/timesheetviewer.component';

const TIMESHEETROUTES: Routes = [
    {
        path: '',
        component: TimesheetManagerComponent
    },
    {
        path: 'summary/:teamCode/:periodStart/:periodFinish',
        component: TeamTimeSummaryComponent, outlet: 'summary'
    },
    {
        path: 'timesheet/:carerCode/:weekCommencing',
        component: TimesheetViewerComponent,
        outlet: 'timesheet'
    }
];

@NgModule({
    imports: [ RouterModule.forChild(TIMESHEETROUTES) ],
    exports: [ RouterModule ]
})
export class TimesheetsRoutingModule { }
