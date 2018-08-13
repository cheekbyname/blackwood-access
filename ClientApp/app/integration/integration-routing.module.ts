import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { IntegrationComponent } from "./integration.component";
import { IntegrationGuard } from "./integration-guard.service";
import { IntegrationLandingComponent } from "./integration.landing.component/integration.landing.component";
import { TeamIntegrationComponent } from "./team.integration.component/team.integration.component";
import { UserIntegrationComponent } from "./user.integration.component/user.integration.component";

const integrationRoutes: Routes = [
    {
        path: 'integration', component: IntegrationComponent, canActivate: [IntegrationGuard], children: [
            { path: '', component: IntegrationLandingComponent },
            { path: 'users', component: UserIntegrationComponent },
            { path: 'teams', component: TeamIntegrationComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(integrationRoutes)],
    exports: [RouterModule]
})
export class IntegrationRoutingModule { }