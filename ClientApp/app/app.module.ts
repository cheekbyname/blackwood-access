import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService,
    CheckboxModule } from 'primeng/primeng';

import { AppRouterModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';

import { AdminModule } from "./admin/admin.module";
import { PayrollModule } from "./payroll/payroll.module";

import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

/* To be removed */
// import { PayrollManagerComponent } from './payroll/payroll.manager/payroll.manager.component';
// import { TimesheetViewerComponent } from './payroll/timesheet.viewer/timesheet.viewer.component';
// import { PayrollSummaryComponent } from './payroll/payroll.summary/payroll.summary.component';
// import { BookingCardComponent } from './payroll/booking.card/booking.card';
// import { BookingDetailComponent } from './payroll/booking.detail/booking.detail.component';
// import { TimesheetAdjustmentComponent } from './payroll/timesheet.adjustment/timesheet.adjustment.component';
// import { PayrollReviewComponent } from "./payroll/payroll.review/payroll.review.component";

import { InitialAssessProvider } from './careassessments/initialassess.provider';
import { UserProvider } from "./user.provider";

/* To be removed */
// import { PayrollProvider } from './payroll/payroll.provider';

// import { AdjustmentOffsetFilter } from './models/adjustment';
// import { ShiftOffsetFilter } from './models/shift';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, NavMenuComponent, InitialAssessManagerComponent, InitialAssessComponent,
        /* To be removed */
        // PayrollManagerComponent, TimesheetViewerComponent, PayrollSummaryComponent, BookingCardComponent,
        // BookingDetailComponent, TimesheetAdjustmentComponent, PayrollReviewComponent,
        /* To be removed */
        HomeComponent//, AdjustmentOffsetFilter, ShiftOffsetFilter
    ],
    imports: [
        /* Platform Modules */
        UniversalModule, FormsModule,
        /* Application Feature Modules */
        AdminModule, PayrollModule,
        /* PrimeNg Component Modules */
        CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, CheckboxModule,
        /* Application Router */
        AppRouterModule
    ],
    providers: [ InitialAssessProvider, ConfirmationService, UserProvider ]
})
export class AppModule {}
