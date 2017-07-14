import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

@NgModule({
    imports: [CommonModule, AdminRoutingModule],
    declarations: [AdminComponent, UserAdminComponent]
})
export class AdminModule { }