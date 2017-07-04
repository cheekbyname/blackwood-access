import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetManagerComponent } from './timesheet.manager/timesheet.manager.component';
import { TimesheetSummaryComponent } from './timesheet.summary/timesheet.summary.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

const TIMESHEETROUTES: Routes = [
    {
        path: '',
        component: TimesheetManagerComponent
    },
    {
        path: 'summary/:teamCode/:periodStart/:periodFinish',
        component: TimesheetSummaryComponent, outlet: 'summary'
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
export class TimesheetRoutingModule { }
