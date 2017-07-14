import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component'
import { UserAdminComponent } from "./user.admin.component/user.admin.component";

const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: UserAdminComponent
            }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}