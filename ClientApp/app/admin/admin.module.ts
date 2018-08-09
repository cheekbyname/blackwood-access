import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckboxModule, ConfirmDialogModule, ConfirmationService, DialogModule, CalendarModule, ListboxModule }
    from "primeng/primeng";

import { AdminComponent } from "./admin.component";
import { AdminLandingComponent } from "./admin.landing.component/admin.landing.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { PayrollAdminComponent } from "./payroll.admin.component/payroll.admin.component";
import { PushMessagingComponent } from "./push.messaging.component/push.messaging.component";
import { ReportingAdminComponent } from "./reporting.admin.component/reporting.admin.component";
import { ScheduleAdminComponent } from "./schedule.admin.component/schedule.admin.component";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";
import { UserChooserComponent } from "./user.chooser.component/user.chooser.component";
import { UserPermissionsComponent } from "./user.permissions.component/user.permissions.component";

import { AdminGuard } from "./admin-guard.service";
import { ReportingProvider } from "../reporting/reporting.provider";
import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, AdminRoutingModule, CheckboxModule, ConfirmDialogModule, ReactiveFormsModule,
        DialogModule, CalendarModule, ListboxModule],
    declarations: [AdminComponent, AdminLandingComponent, PayrollAdminComponent, UserAdminComponent, ReportingAdminComponent,
        UserPermissionsComponent, PushMessagingComponent, ScheduleAdminComponent, UserChooserComponent],
    providers: [ConfirmationService, AdminGuard, UserProvider, ReportingProvider]
})
export class AdminModule { }