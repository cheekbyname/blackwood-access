import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckboxModule, ConfirmDialogModule, ConfirmationService, DialogModule } from "primeng/primeng";

import { ReportingComponent } from "./reporting.component";
import { ReportingHomeComponent } from "./reporting.home.component/reporting.home.component";
import { ReportingScheduleComponent } from "./reporting.schedule.component/reporting.schedule.component";

import { SafeUrlPipe } from "./reporting.home.component/reporting.home.component";

import { ReportingRoutingModule } from "./reporting-routing.module";

import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, ReportingRoutingModule, CheckboxModule, ConfirmDialogModule, ReactiveFormsModule, DialogModule],
    declarations: [ReportingComponent, ReportingHomeComponent, ReportingScheduleComponent, SafeUrlPipe],
    providers: [ConfirmationService, UserProvider]
})
export class ReportingModule { }