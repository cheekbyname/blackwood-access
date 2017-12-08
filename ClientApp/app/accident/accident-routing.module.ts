import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { AccidentComponent } from './accident.component'
import { AccidentIncidentComponent } from "./accident.incident.component/accident.incident.component";
import { AccidentMainComponent } from "./accident.main.component/accident.main.component"

const accidentRoutes: Routes = [
    {
        path: 'accident',
        component: AccidentComponent,
        children: [
            {
                path: '',
                component: AccidentMainComponent
            },
            {
                path: 'incident/:id',
                component: AccidentIncidentComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(accidentRoutes)],
    exports: [RouterModule]
})
export class AccidentRoutingModule {}