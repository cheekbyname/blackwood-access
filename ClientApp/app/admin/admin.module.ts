import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckboxModule, ConfirmDialogModule, ConfirmationService, DialogModule } from "primeng/primeng";

import { AdminComponent } from "./admin.component";
import { AdminGuard } from "./admin-guard.service";
import { AdminLandingComponent } from "./admin.landing.component/admin.landing.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { PayrollAdminComponent } from "./payroll.admin.component/payroll.admin.component";
import { ReportingAdminComponent } from "./reporting.admin.component/reporting.admin.component";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

import { UserProvider } from "../user.provider";
import { AppModuleShared } from "../app.shared.module";
import { UserPermissionsComponent } from "./user.permissions.component/user.permissions.component";

@NgModule({
    imports: [CommonModule, FormsModule, AdminRoutingModule, CheckboxModule, ConfirmDialogModule, ReactiveFormsModule,
        DialogModule],
    declarations: [AdminComponent, AdminLandingComponent, PayrollAdminComponent, UserAdminComponent, ReportingAdminComponent,
        UserPermissionsComponent],
    providers: [ConfirmationService, AdminGuard, UserProvider]
})
export class AdminModule { }