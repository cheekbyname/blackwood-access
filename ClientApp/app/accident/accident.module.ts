import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CheckboxModule, AutoCompleteModule } from "primeng/primeng";

import { AccidentComponent } from "./accident.component";
import { AccidentIncidentComponent } from "./accident.incident.component/accident.incident.component";
import { AccidentMainComponent } from "./accident.main.component/accident.main.component";
import { AccidentRoutingModule } from "./accident-routing.module";
import { PersonComponent } from "./components/person.component/person.component";

import { AccidentProvider } from "./accident-provider";
import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, AccidentRoutingModule, CheckboxModule, AutoCompleteModule],
    declarations: [AccidentComponent, AccidentMainComponent, AccidentIncidentComponent, PersonComponent],
    providers: [AccidentProvider, UserProvider]
})
export class AccidentModule { }