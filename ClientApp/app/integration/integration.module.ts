// Angular/PrimeNg
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { IntegrationComponent } from "./integration.component";
import { IntegrationLandingComponent } from "./integration.landing.component/integration.landing.component";
import { IntegrationRoutingModule } from "./integration-routing.module";
import { TeamIntegrationComponent } from "./team.integration.component/team.integration.component";
import { UserIntegrationComponent } from "./user.integration.component/user.integration.component";

// Providers
import { IntegrationGuard } from "./integration-guard.service";
import { IntegrationProvider } from "./integration.provider";
import { UserProvider } from "../user.provider";

@NgModule({
	imports: [ CommonModule, IntegrationRoutingModule ],
	declarations: [ IntegrationComponent, IntegrationLandingComponent, TeamIntegrationComponent, UserIntegrationComponent ],
	providers: [ UserProvider, IntegrationGuard, IntegrationProvider ]
})
export class IntegrationModule { }