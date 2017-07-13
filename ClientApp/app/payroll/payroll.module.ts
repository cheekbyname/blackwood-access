import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';

import { BookingCardComponent } from './booking.card/booking.card';
import { BookingDetailComponent } from './booking.detail/booking.detail.component';
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetAdjustmentComponent } from './timesheet.adjustment/timesheet.adjustment.component';
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

import { PayrollProvider } from './payroll.provider';
import { UserProvider } from "../user.provider";

@NgModule({
	imports: [CommonModule, PayrollRoutingModule],
	declarations: [BookingCardComponent, BookingDetailComponent, PayrollSummaryComponent, TimesheetAdjustmentComponent,
		PayrollManagerComponent, TimesheetViewerComponent],
	providers: [PayrollProvider, UserProvider]
})
export class TimesheetModule {}
