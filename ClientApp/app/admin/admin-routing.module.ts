import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from "./admin-guard.service";

import { AdminComponent } from './admin.component'
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
            {
                path: '',
                component: UserAdminComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}