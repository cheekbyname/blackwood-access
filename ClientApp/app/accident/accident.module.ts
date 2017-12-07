import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CheckboxModule } from "primeng/primeng";

import { AccidentComponent } from "./accident.component";
import { AccidentMainComponent } from "./accident.main.component/accident.main.component";
import { AccidentRoutingModule } from "./accident-routing.module";

import { AccidentProvider } from "./accident-provider";
import { UserProvider } from "../user.provider";

@NgModule({
    imports: [CommonModule, FormsModule, AccidentRoutingModule, CheckboxModule],
    declarations: [AccidentComponent, AccidentMainComponent],
    providers: [AccidentProvider, UserProvider]
})
export class AccidentModule { }