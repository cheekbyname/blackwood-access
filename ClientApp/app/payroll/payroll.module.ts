import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, CheckboxModule,
	ConfirmationService, InputSwitchModule, DataTableModule, SharedModule } from "primeng/primeng";

import { PayrollGuard } from "./payroll-guard.service";
import { PayrollRoutingModule } from './payroll-routing.module';

import { BookingCardComponent } from './booking.card/booking.card';
import { BookingDetailComponent } from './booking.detail/booking.detail.component';
import { PayrollApprovalComponent } from './payroll.approval/payroll.approval.component';
import { PayrollComponent } from "./payroll.component";
import { PayrollExportComponent } from "./payroll.export/payroll.export.component";
import { PayrollManagerComponent } from './payroll.manager/payroll.manager.component';
import { PayrollReviewComponent } from "./payroll.review/payroll.review.component";
import { PayrollSummaryComponent } from './payroll.summary/payroll.summary.component';
import { TimesheetAdjustmentComponent } from './timesheet.adjustment/timesheet.adjustment.component';
import { TimesheetViewerComponent } from './timesheet.viewer/timesheet.viewer.component';

import { PayrollProvider } from './payroll.provider';
import { UserProvider } from "../user.provider";

import { AdjustmentOffsetFilter } from '../models/payroll/Adjustment';
import { ShiftOffsetFilter } from "../models/payroll/Shift";

@NgModule({
    imports: [CommonModule, FormsModule, BrowserAnimationsModule, CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule,
        CheckboxModule, InputSwitchModule, DataTableModule, SharedModule, PayrollRoutingModule],
	declarations: [PayrollComponent, BookingCardComponent, BookingDetailComponent, PayrollExportComponent, PayrollSummaryComponent,
		TimesheetAdjustmentComponent, PayrollManagerComponent, TimesheetViewerComponent, PayrollReviewComponent, PayrollApprovalComponent,
		AdjustmentOffsetFilter, ShiftOffsetFilter],	// , ShiftOffsetFilter
	providers: [PayrollGuard, PayrollProvider, UserProvider, ConfirmationService]
})
export class PayrollModule {}
