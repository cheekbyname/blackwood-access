import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';

import { BookingCardComponent } from './booking.card/booking.card';
import { BookingDetailComponent } from './booking.detail/booking.detail.component';
import { TimesheetSummaryComponent } from './timesheet.summary/timesheet.summary.component';
import { TimesheetAdjustmentComponent } from './timesheet.adjustment/timesheet.adjustment.component';
import { TimesheetManagerComponent } from './timesheet.manager/timesheet.manager.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

import { TimesheetProvider } from './timesheet.provider';

@NgModule({
	imports: [CommonModule, TimesheetRoutingModule],
	declarations: [BookingCardComponent, BookingDetailComponent, TimesheetSummaryComponent, TimesheetAdjustmentComponent,
		TimesheetManagerComponent, TimesheetViewerComponent],
	providers: [TimesheetProvider]
})
export class TimesheetModule {}
