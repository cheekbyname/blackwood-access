import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Incident } from "../models/Incident";
import { Category } from "../models/Category";
import { Location } from "../models/Location";
import { Type } from "../models/Type";

import { AccidentProvider } from "../accident-provider";

@Component({
    selector: 'incident-form',
    template: require('./accident.incident.component.html'),
    styles: [require('./accident.incident.component.css')]
})
export class AccidentIncidentComponent implements OnInit {
    constructor(private route: ActivatedRoute, public accPro: AccidentProvider) {
        this.accPro.incident$.subscribe(inc => this.incident = inc);
        this.accPro.locations$.subscribe(locs => this.locations = locs);
        this.accPro.categories$.subscribe(cats => this.categories = cats);
        this.accPro.types$.subscribe(typs => this.types = typs);
    }

    ngOnInit() {
        this.route.params.subscribe(p => {
            var id = p['id'];
            if (id) this.accPro.getIncident(id);
        });
    }

    incident: Incident;
    locations: Location[];
    categories: Category[];
    types: Type[];
}