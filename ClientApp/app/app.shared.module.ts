import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {
    CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService,
    CheckboxModule, InputSwitchModule
} from 'primeng/primeng';

import { AppRouterModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { NotAuthorisedComponent } from "./components/notauthorised/notauthorised.component";
import { NotFoundComponent } from './components/notfound/notfound.component';
import { HomeComponent } from './components/home/home.component';

import { AccidentModule } from "./accident/accident.module";
import { AdminModule } from "./admin/admin.module";
import { PayrollModule } from "./payroll/payroll.module";
import { ReportingModule } from "./reporting/reporting.module";

import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';

import { InitialAssessProvider } from './careassessments/initialassess.provider';
import { UserProvider } from "./user.provider";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, NavMenuComponent, NotAuthorisedComponent, HomeComponent, NotFoundComponent,
        /* Initial Assessments to be modularised */
        InitialAssessManagerComponent, InitialAssessComponent],
    imports: [
        /* Platform Modules */
        FormsModule, CommonModule, HttpModule, BrowserAnimationsModule,
        /* PrimeNg Component Modules */
        CalendarModule, SliderModule, DialogModule, SpinnerModule, ConfirmDialogModule, CheckboxModule, InputSwitchModule,
        /* Application Feature Modules */
        AccidentModule, AdminModule, PayrollModule, ReportingModule,
        /* Application Router */
        AppRouterModule
    ],
    providers: [InitialAssessProvider, ConfirmationService, UserProvider]
})
export class AppModuleShared {
}
