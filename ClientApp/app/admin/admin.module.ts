import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CheckboxModule, ConfirmDialogModule, ConfirmationService } from "primeng/primeng";

import { AdminComponent } from "./admin.component";
import { AdminGuard } from "./admin-guard.service";
import { AdminRoutingModule } from "./admin-routing.module";
import { PayrollAdminComponent } from "./payroll.admin.component/payroll.admin.component";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, AdminRoutingModule, CheckboxModule, ConfirmDialogModule, ReactiveFormsModule],
    declarations: [AdminComponent, PayrollAdminComponent, UserAdminComponent],
    providers: [ConfirmationService, UserProvider, AdminGuard]
})
export class AdminModule { }