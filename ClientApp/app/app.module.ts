import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule } from 'primeng/primeng';

import { AppRouterModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';

import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

/* To be removed */
import { TimesheetManagerComponent } from './timesheets/timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './timesheets/timesheetviewer/timesheetviewer.component';
import { TeamTimeSummaryComponent } from './timesheets/teamtimesummary/teamtimesummary.component';
import { BookingCardComponent } from './timesheets/booking.card/booking.card';
import { BookingDetailComponent } from './timesheets/booking.detail/booking.detail.component';
import { TimesheetAdjustmentComponent } from './timesheets/timesheet.adjustment/timesheet.adjustment.component';

import { InitialAssessProvider } from './careassessments/initialassess.provider';
/* To be removed */
import { TimesheetProvider } from './timesheets/timesheet.provider';

import { AdjustmentOffsetFilter } from './models/adjustment';
import { ShiftOffsetFilter } from './models/shift';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, NavMenuComponent, InitialAssessManagerComponent, InitialAssessComponent,
        /* To be removed */
        TimesheetManagerComponent, TimesheetViewerComponent, TeamTimeSummaryComponent, BookingCardComponent,
        BookingDetailComponent, TimesheetAdjustmentComponent,
        /* To be removed */
        HomeComponent, AdjustmentOffsetFilter, ShiftOffsetFilter
    ],
    imports: [
        UniversalModule,
        AppRouterModule,
        FormsModule,
        /* Consider moving into timesheet module */
        CalendarModule, SliderModule, DialogModule, SpinnerModule
    ],
    providers: [ TimesheetProvider /* To be removed */, InitialAssessProvider ]
})
export class AppModule {}
