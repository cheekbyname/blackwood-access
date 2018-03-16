import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { ReportingComponent } from './reporting.component';
import { ReportingHomeComponent } from "./reporting.home.component/reporting.home.component";
import { ReportingLandingComponent } from "./reporting.landing.component/reporting.landing.component";
import { ReportingScheduleComponent } from "./reporting.schedule.component/reporting.schedule.component";

const reportingRoutes: Routes = [
    {
        path: 'reports',
        component: ReportingComponent,
        children: [
            {
                path: '',
                component: ReportingLandingComponent
            },
            {
                path: 'home',
                component: ReportingHomeComponent
            },
            {
                path: 'scheduled',
                component: ReportingScheduleComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(reportingRoutes)],
    exports: [RouterModule]
})
export class ReportingRoutingModule {}