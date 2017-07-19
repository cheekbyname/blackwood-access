import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule } from '@angular/forms';

import { CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService,
    CheckboxModule } from 'primeng/primeng';

import { AppRouterModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { NotAuthorisedComponent } from "./components/notauthorised/notauthorised.component";
import { HomeComponent } from './components/home/home.component';

import { AdminModule } from "./admin/admin.module";
import { PayrollModule } from "./payroll/payroll.module";

import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

import { InitialAssessProvider } from './careassessments/initialassess.provider';
import { UserProvider } from "./user.provider";

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent, NavMenuComponent, NotAuthorisedComponent, HomeComponent,
        /* Initial Assessments to be modularised */
        InitialAssessManagerComponent, InitialAssessComponent ],
    imports: [
        /* Platform Modules */
        UniversalModule, FormsModule,
        /* Application Feature Modules */
        AdminModule, PayrollModule,
        /* PrimeNg Component Modules */
        CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, CheckboxModule,
        /* Application Router */
        AppRouterModule
    ],
    providers: [ InitialAssessProvider, ConfirmationService, UserProvider ]
})
export class AppModule {}
