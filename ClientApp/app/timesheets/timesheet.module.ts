import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';

import { BookingCardComponent } from './booking.card/booking.card';
import { BookingDetailComponent } from './booking.detail/booking.detail.component';
import { TeamTimeSummaryComponent } from './teamtimesummary/teamtimesummary.component';
import { TimesheetAdjustmentComponent } from './timesheet.adjustment/timesheet.adjustment.component';
import { TimesheetManagerComponent } from './timesheetmanager/timesheetmanager.component';
import { TimesheetViewerComponent } from './timesheetviewer/timesheetviewer.component';

import { TimesheetProvider } from './timesheet.provider';

@NgModule({
	imports: [CommonModule, TimesheetRoutingModule],
	declarations: [BookingCardComponent, BookingDetailComponent, TeamTimeSummaryComponent, TimesheetAdjustmentComponent,
		TimesheetManagerComponent, TimesheetViewerComponent],
	providers: [TimesheetProvider]
})
export class TimesheetModule {}
