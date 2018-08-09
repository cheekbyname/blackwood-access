import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable } from 'rxjs';

import { Incident } from "../models/Incident";
import { Category } from "../models/Category";
import { Location } from "../models/Location";
import { Type } from "../models/Type";
import { Person } from "../models/Person";

import { AccidentProvider } from "../accident-provider";

@Component({
    selector: 'incident-form',
    templateUrl: './accident.incident.component.html',
    styleUrls: ['./accident.incident.component.css']
})
export class AccidentIncidentComponent implements OnInit {
    constructor(private route: ActivatedRoute, public accPro: AccidentProvider) {
        this.accPro.incident$.subscribe(inc => this.incident = inc);
        this.accPro.locations$.subscribe(locs => this.locations = locs);
        this.accPro.categories$.subscribe(cats => this.categories = cats);
        this.accPro.types$.subscribe(typs => this.types = typs);
        this.accPro.people$.subscribe(peeps => this.people = peeps);

        Observable
            .combineLatest(this.accPro.incident$, this.accPro.types$, (i: Incident, t: Type[]) => {
                return { incident: i, types: t };
            })
            .subscribe(x => {
                if (x.incident !== null && x.types !== null) {
                    this.filteredTypes = x.types.filter(t => t.incidentCategoryId == x.incident.incidentCategoryId);
                }
            });
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
    filteredTypes: Type[];
    people: Person[];

    errored: boolean;

    categoryChanged(categoryId) {
        this.filteredTypes = this.types.filter(t => t.incidentCategoryId == categoryId);
    }
}