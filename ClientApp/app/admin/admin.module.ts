import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CheckboxModule } from "primeng/primeng";

import { AdminComponent } from "./admin.component";
import { AdminGuard } from "./admin-guard.service";
import { AdminRoutingModule } from "./admin-routing.module";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, AdminRoutingModule, CheckboxModule],
    declarations: [AdminComponent, UserAdminComponent],
    providers: [UserProvider, AdminGuard]
})
export class AdminModule { }