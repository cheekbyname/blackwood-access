import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { TimesheetManagerComponent } from './components/timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './components/timesheetviewer/timesheetviewer.component';
import { TeamTimeSummaryComponent } from './components/teamtimesummary/teamtimesummary.component';
import { BookingCardComponent } from './components/cards/booking.card/booking.card';
import { TimesheetService } from './services/timesheet.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        TimesheetManagerComponent,
        TimesheetViewerComponent,
        TeamTimeSummaryComponent,
        BookingCardComponent,
        HomeComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'timesheet-manager', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'timesheet-manager', component: TimesheetManagerComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        FormsModule,
        CalendarModule
    ],
    providers: [ TimesheetService ]
})
export class AppModule {
}
