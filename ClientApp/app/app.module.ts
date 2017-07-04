import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { AppRouterModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';

import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

/* To be removed */
import { TimesheetManagerComponent } from './timesheets/timesheet.manager/timesheet.manager.component';
import { TimesheetViewerComponent } from './timesheets/timesheet.viewer/timesheet.viewer.component';
import { TimesheetSummaryComponent } from './timesheets/timesheet.summary/timesheet.summary.component';
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
        TimesheetManagerComponent, TimesheetViewerComponent, TimesheetSummaryComponent, BookingCardComponent,
        BookingDetailComponent, TimesheetAdjustmentComponent,
        /* To be removed */
        HomeComponent, AdjustmentOffsetFilter, ShiftOffsetFilter
    ],
    imports: [
        UniversalModule,
        AppRouterModule,
        FormsModule,
        /* Consider moving into timesheet module */
        CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule
    ],
    providers: [ TimesheetProvider /* To be removed */, InitialAssessProvider, ConfirmationService ]
})
export class AppModule {}
