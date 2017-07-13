import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

const TIMESHEETROUTES: Routes = [
    {
        path: '',
        component: PayrollManagerComponent
    },
    {
        path: 'summary/:teamCode/:periodStart/:periodFinish',
        component: PayrollSummaryComponent, outlet: 'summary'
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
export class PayrollRoutingModule { }
