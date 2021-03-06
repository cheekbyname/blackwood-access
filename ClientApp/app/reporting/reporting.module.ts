import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckboxModule, ConfirmDialogModule, ConfirmationService, DialogModule, CalendarModule } from "primeng/primeng";

import { TooltipModule } from "ngx-bootstrap/tooltip";

import { ReportingComponent } from "./reporting.component";
import { ReportingHomeComponent } from "./reporting.home.component/reporting.home.component";
import { ReportingLandingComponent } from "./reporting.landing.component/reporting.landing.component";
import { ReportingScheduleComponent } from "./reporting.schedule.component/reporting.schedule.component";
import { ScheduleEditorComponent } from "./schedule.editor.component/schedule.editor.component";

import { ReportingRoutingModule } from "./reporting-routing.module";
import { ReportingProvider } from "./reporting.provider";

import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, CheckboxModule, ConfirmDialogModule, ReactiveFormsModule, DialogModule, CalendarModule,
        ReportingRoutingModule, TooltipModule.forRoot()],
    declarations: [ReportingComponent, ReportingHomeComponent, ReportingLandingComponent, ReportingScheduleComponent,
        ScheduleEditorComponent],
    providers: [ConfirmationService, UserProvider, ReportingProvider]
})
export class ReportingModule { }