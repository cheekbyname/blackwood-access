import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InitialAssessManagerComponent } from './initialassessmanager/initialassessmanager.component';
import { InitialAssessComponent } from './initialassess/initialassess.component';

const ASSESSMENTROUTES: Routes = [
    { path: 'initial-assess-manager', component: InitialAssessManagerComponent },
	{ path: 'initial-assess/:id', component: InitialAssessComponent },
];

@NgModule({
    imports: [ RouterModule.forChild(ASSESSMENTROUTES) ],
    exports: [ RouterModule ]
})
export class CareAssessmentsRoutingModule { }
