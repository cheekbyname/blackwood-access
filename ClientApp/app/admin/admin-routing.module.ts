import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component'
import { AdminGuard } from "./admin-guard.service";
import { AdminLandingComponent } from "./admin.landing.component/admin.landing.component";
import { PayrollAdminComponent } from "./payroll.admin.component/payroll.admin.component";
import { PushMessagingComponent } from "./push.messaging.component/push.messaging.component";
import { UserAdminComponent } from "./user.admin.component/user.admin.component";
import { UserPermissionsComponent } from "./user.permissions.component/user.permissions.component";

const adminRoutes: Routes = [
    {
        path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
            { path: '', component: AdminLandingComponent },
            { path: 'users', component: UserAdminComponent },
            { path: 'users/:user', component: UserPermissionsComponent },
            { path: 'payroll', component: PayrollAdminComponent },
            { path: 'messaging', component: PushMessagingComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }