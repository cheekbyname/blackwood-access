import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, CheckboxModule,
	ConfirmationService } from "primeng/primeng";

import { PayrollGuard } from "./payroll-guard.service";
import { PayrollRoutingModule } from './payroll-routing.module';

import { PayrollComponent } from "./payroll.component";
import { BookingCardComponent } from './booking.card/booking.card';
import { BookingDetailComponent } from './booking.detail/booking.detail.component';
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetAdjustmentComponent } from './timesheet.adjustment/timesheet.adjustment.component';
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollReviewComponent } from "./payroll.review/payroll.review.component";
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

import { PayrollProvider } from './payroll.provider';
import { UserProvider } from "../user.provider";

import { AdjustmentOffsetFilter } from '../models/adjustment';
import { ShiftOffsetFilter } from '../models/shift';

@NgModule({
	imports: [CommonModule, FormsModule, CalendarModule, SliderModule, DialogModule, SpinnerModule,
		ConfirmDialogModule, CheckboxModule, PayrollRoutingModule],
	declarations: [PayrollComponent, BookingCardComponent, BookingDetailComponent, PayrollSummaryComponent,
		TimesheetAdjustmentComponent, PayrollManagerComponent, TimesheetViewerComponent, PayrollReviewComponent,
		AdjustmentOffsetFilter, ShiftOffsetFilter],
	providers: [PayrollGuard, PayrollProvider, UserProvider, ConfirmationService]
})
export class PayrollModule {}
