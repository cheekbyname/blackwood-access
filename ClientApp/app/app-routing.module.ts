import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotAuthorisedComponent } from "./components/notauthorised/notauthorised.component";
import { HomeComponent } from './components/home/home.component';
import { InitialAssessManagerComponent } from './careassessments/initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './careassessments/initialassess/initialassess.component';
import { NotFoundComponent } from './components/notfound/notfound.component';

const APPROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
    { path: 'no-auth', component: NotAuthorisedComponent },
    { path: 'not-found', component: NotFoundComponent },
	{ path: '**', redirectTo: 'not-found' }
];

@NgModule({
	imports: [ RouterModule.forRoot(APPROUTES) ],	// , {enableTracing: true}
	exports: [ RouterModule ]
})
export class AppRouterModule {}
