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
import { TimesheetManagerComponent } from './timesheets/timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './timesheets/timesheetviewer/timesheetviewer.component';
import { TeamTimeSummaryComponent } from './timesheets/teamtimesummary/teamtimesummary.component';
import { BookingCardComponent } from './timesheets/booking.card/booking.card';

import { InitialAssessProvider } from './careassessments/initialassess.provider';
import { TimesheetProvider } from './timesheets/timesheet.provider';

import { AdjustmentOffsetFilter } from './models/adjustment';
import { ShiftOffsetFilter } from './models/shift';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, NavMenuComponent, InitialAssessManagerComponent, InitialAssessComponent, TimesheetManagerComponent,
        TimesheetViewerComponent, TeamTimeSummaryComponent, BookingCardComponent, HomeComponent, AdjustmentOffsetFilter,
        ShiftOffsetFilter
    ],
    imports: [
        UniversalModule,
        AppRouterModule,
        FormsModule,
        CalendarModule, SliderModule, DialogModule, SpinnerModule
    ],
    providers: [ TimesheetProvider, InitialAssessProvider ]
})
export class AppModule {
}
