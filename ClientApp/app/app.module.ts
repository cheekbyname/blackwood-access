import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule } from 'primeng/primeng';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';

import { InitialAssessManagerComponent } from './components/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './components/initialassess/initialassess.component';
import { TimesheetManagerComponent } from './components/timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './components/timesheetviewer/timesheetviewer.component';
import { TeamTimeSummaryComponent } from './components/teamtimesummary/teamtimesummary.component';
import { BookingCardComponent } from './components/cards/booking.card/booking.card';

import { InitialAssessProvider } from './providers/initialassess.provider';
import { TimesheetProvider } from './providers/timesheet.provider';

import { AdjustmentOffsetFilter } from './models/adjustment';
import { ShiftOffsetFilter } from './models/shift';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, NavMenuComponent, CounterComponent, FetchDataComponent, InitialAssessManagerComponent,
        InitialAssessComponent, TimesheetManagerComponent, TimesheetViewerComponent, TeamTimeSummaryComponent, BookingCardComponent,
        HomeComponent, AdjustmentOffsetFilter, ShiftOffsetFilter
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'timesheet-manager', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'timesheet-manager', component: TimesheetManagerComponent },
            { path: 'initial-assess-manager', component: InitialAssessManagerComponent },
            { path: 'initial-assess/:id', component: InitialAssessComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        FormsModule,
        CalendarModule, SliderModule, DialogModule, SpinnerModule
    ],
    providers: [ TimesheetProvider, InitialAssessProvider ]
})
export class AppModule {
}
