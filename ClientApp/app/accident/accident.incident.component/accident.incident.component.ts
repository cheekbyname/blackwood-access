import { Component } from "@angular/core";

import { Incident } from "../models/Incident";

import { AccidentProvider } from "../accident-provider";

@Component({
    selector: 'incident-form',
    template: require('./accident.incidient.component.html'),
    styles: [require('./accident.incident.component.css')]
})
export class IncidentComponent {
    
}