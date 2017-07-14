import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CheckboxModule } from "primeng/primeng";

import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

@NgModule({
    imports: [CommonModule, FormsModule, AdminRoutingModule, CheckboxModule],
    declarations: [AdminComponent, UserAdminComponent]
})
export class AdminModule { }